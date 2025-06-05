
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

interface DocumentField {
  id: string;
  type: 'signature' | 'initial' | 'date' | 'text' | 'checkbox';
  x: number;
  y: number;
  width: number;
  height: number;
  role: string;
  mergeField?: string;
  required: boolean;
  placeholder?: string;
}

interface CreateDocumentRequest {
  templateId: string;
  signerEmail: string;
  signerName: string;
  documentName: string;
  clientData?: Record<string, any>;
  fields?: DocumentField[];
  mergeData?: Record<string, string>;
}

class SignNowService {
  private config: SignNowConfig;
  private accessToken: string | null = null;

  constructor() {
    // Get configuration from localStorage or use empty strings as defaults
    const storedConfig = localStorage.getItem('signnow_config');
    const defaultConfig = {
      clientId: '',
      clientSecret: '',
      apiUrl: 'https://api.signnow.com'
    };

    this.config = storedConfig ? JSON.parse(storedConfig) : defaultConfig;
  }

  // Method to update configuration
  updateConfig(clientId: string, clientSecret: string) {
    this.config = {
      clientId,
      clientSecret,
      apiUrl: 'https://api.signnow.com'
    };
    localStorage.setItem('signnow_config', JSON.stringify(this.config));
    // Clear access token when config changes
    this.accessToken = null;
  }

  // Method to check if service is configured
  isConfigured(): boolean {
    return !!(this.config.clientId && this.config.clientSecret);
  }

  async authenticate(): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('SignNow service is not configured. Please provide Client ID and Client Secret.');
    }

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

  async addDocumentFields(documentId: string, fields: DocumentField[]): Promise<void> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const signNowFields = fields.map(field => ({
        type: this.mapFieldTypeToSignNow(field.type),
        x: field.x,
        y: field.y,
        width: field.width,
        height: field.height,
        page_number: 0, // Assuming single page for now
        role: field.role,
        required: field.required,
        prefilled_text: field.mergeField ? `{{${field.mergeField}}}` : undefined,
        placeholder_text: field.placeholder
      }));

      const response = await fetch(`${this.config.apiUrl}/document/${documentId}/fields`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: signNowFields }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(`Add fields failed: ${data.error}`);
      }
    } catch (error) {
      console.error('SignNow add fields error:', error);
      throw error;
    }
  }

  private mapFieldTypeToSignNow(fieldType: string): string {
    const typeMap = {
      'signature': 'signature',
      'initial': 'initials',
      'date': 'date',
      'text': 'text',
      'checkbox': 'checkbox'
    };
    return typeMap[fieldType as keyof typeof typeMap] || 'text';
  }

  private populateMergeFields(text: string, mergeData: Record<string, string>): string {
    let populatedText = text;
    Object.entries(mergeData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      populatedText = populatedText.replace(new RegExp(placeholder, 'g'), value);
    });
    return populatedText;
  }

  async sendForSignature(request: CreateDocumentRequest): Promise<SignNowDocument> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      // If fields are provided, add them to the document first
      if (request.fields && request.fields.length > 0) {
        await this.addDocumentFields(request.templateId, request.fields);
      }

      // Prepare merge data if provided
      let documentName = request.documentName;
      let message = 'Please review and sign this document.';
      
      if (request.mergeData) {
        documentName = this.populateMergeFields(documentName, request.mergeData);
        message = this.populateMergeFields(message, request.mergeData);
      }

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
              subject: `Please sign: ${documentName}`,
              message: message,
            }
          ],
          from: 'noreply@yourcompany.com',
          subject: `Signature Request: ${documentName}`,
          message: message,
          // Include merge data in the request
          merge_data: request.mergeData || {},
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Send for signature failed: ${data.error}`);
      }

      return {
        id: request.templateId,
        name: documentName,
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
export type { SignNowDocument, SignNowSigner, CreateDocumentRequest, DocumentField };
