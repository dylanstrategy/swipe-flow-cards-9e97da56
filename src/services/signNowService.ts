
interface SignNowConfig {
  clientId: string;
  clientSecret: string;
  apiUrl: string;
}

interface SignNowDocument {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'cancelled';
  created: string;
  signers: SignNowSigner[];
}

interface SignNowSigner {
  email: string;
  name: string;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: string;
}

interface CreateDocumentRequest {
  templateId: string;
  signerEmail: string;
  signerName: string;
  documentName: string;
  clientData?: Record<string, any>;
}

class SignNowService {
  private config: SignNowConfig;
  private accessToken: string | null = null;

  constructor() {
    this.config = {
      clientId: process.env.SIGNNOW_CLIENT_ID || '',
      clientSecret: process.env.SIGNNOW_CLIENT_SECRET || '',
      apiUrl: 'https://api.signnow.com'
    };
  }

  async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.config.apiUrl}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Authentication failed: ${data.error_description}`);
      }

      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('SignNow authentication error:', error);
      throw error;
    }
  }

  async uploadDocument(file: File): Promise<string> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.config.apiUrl}/document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Document upload failed: ${data.error}`);
      }

      return data.id;
    } catch (error) {
      console.error('SignNow document upload error:', error);
      throw error;
    }
  }

  async sendForSignature(request: CreateDocumentRequest): Promise<SignNowDocument> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      // Create signing request
      const response = await fetch(`${this.config.apiUrl}/document/${request.templateId}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [
            {
              email: request.signerEmail,
              role_id: '',
              role: 'Signer',
              order: 1,
              reassign: '0',
              decline_by_signature: '0',
              reminder: 4,
              expiration_days: 15,
              subject: `Please sign: ${request.documentName}`,
              message: 'Please review and sign this document.',
            }
          ],
          from: 'noreply@yourcompany.com',
          subject: `Signature Request: ${request.documentName}`,
          message: 'Please review and sign the attached document.',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Send for signature failed: ${data.error}`);
      }

      return {
        id: request.templateId,
        name: request.documentName,
        status: 'pending',
        created: new Date().toISOString(),
        signers: [
          {
            email: request.signerEmail,
            name: request.signerName,
            status: 'pending',
          }
        ]
      };
    } catch (error) {
      console.error('SignNow send for signature error:', error);
      throw error;
    }
  }

  async getDocumentStatus(documentId: string): Promise<SignNowDocument> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/document/${documentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Get document status failed: ${data.error}`);
      }

      return {
        id: data.id,
        name: data.document_name,
        status: data.status,
        created: data.created,
        signers: data.field_invites?.map((invite: any) => ({
          email: invite.email,
          name: invite.role,
          status: invite.status,
          signedAt: invite.updated,
        })) || []
      };
    } catch (error) {
      console.error('SignNow get document status error:', error);
      throw error;
    }
  }

  async downloadSignedDocument(documentId: string): Promise<Blob> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/document/${documentId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download signed document');
      }

      return await response.blob();
    } catch (error) {
      console.error('SignNow download document error:', error);
      throw error;
    }
  }
}

export const signNowService = new SignNowService();
export type { SignNowDocument, SignNowSigner, CreateDocumentRequest };
