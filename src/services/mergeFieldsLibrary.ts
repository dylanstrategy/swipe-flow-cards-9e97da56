
export interface MergeFieldCategory {
  id: string;
  name: string;
  description: string;
  fields: MergeField[];
}

export interface MergeField {
  id: string;
  name: string;
  label: string;
  description: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'email' | 'phone' | 'address' | 'boolean';
  category: string;
  example?: string;
}

export const MERGE_FIELD_CATEGORIES: MergeFieldCategory[] = [
  {
    id: 'operator',
    name: 'Operator/Landlord',
    description: 'Information about the property operator or landlord',
    fields: [
      {
        id: 'operator_first_name',
        name: 'operator_first_name',
        label: 'Operator First Name',
        description: 'First name of the property operator',
        type: 'text',
        category: 'operator',
        example: 'John'
      },
      {
        id: 'operator_last_name',
        name: 'operator_last_name',
        label: 'Operator Last Name',
        description: 'Last name of the property operator',
        type: 'text',
        category: 'operator',
        example: 'Smith'
      },
      {
        id: 'operator_full_name',
        name: 'operator_full_name',
        label: 'Operator Full Name',
        description: 'Full name of the property operator',
        type: 'text',
        category: 'operator',
        example: 'John Smith'
      },
      {
        id: 'operator_email',
        name: 'operator_email',
        label: 'Operator Email',
        description: 'Email address of the property operator',
        type: 'email',
        category: 'operator',
        example: 'john.smith@property.com'
      },
      {
        id: 'operator_phone',
        name: 'operator_phone',
        label: 'Operator Phone',
        description: 'Phone number of the property operator',
        type: 'phone',
        category: 'operator',
        example: '(555) 123-4567'
      },
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        description: 'Name of the property management company',
        type: 'text',
        category: 'operator',
        example: 'ABC Property Management'
      },
      {
        id: 'company_address',
        name: 'company_address',
        label: 'Company Address',
        description: 'Address of the property management company',
        type: 'address',
        category: 'operator',
        example: '123 Main St, City, State 12345'
      }
    ]
  },
  {
    id: 'resident',
    name: 'Resident/Tenant',
    description: 'Information about the resident or tenant',
    fields: [
      {
        id: 'resident_first_name',
        name: 'resident_first_name',
        label: 'Resident First Name',
        description: 'First name of the resident',
        type: 'text',
        category: 'resident',
        example: 'Jane'
      },
      {
        id: 'resident_last_name',
        name: 'resident_last_name',
        label: 'Resident Last Name',
        description: 'Last name of the resident',
        type: 'text',
        category: 'resident',
        example: 'Doe'
      },
      {
        id: 'resident_full_name',
        name: 'resident_full_name',
        label: 'Resident Full Name',
        description: 'Full name of the resident',
        type: 'text',
        category: 'resident',
        example: 'Jane Doe'
      },
      {
        id: 'resident_email',
        name: 'resident_email',
        label: 'Resident Email',
        description: 'Email address of the resident',
        type: 'email',
        category: 'resident',
        example: 'jane.doe@email.com'
      },
      {
        id: 'resident_phone',
        name: 'resident_phone',
        label: 'Resident Phone',
        description: 'Phone number of the resident',
        type: 'phone',
        category: 'resident',
        example: '(555) 987-6543'
      },
      {
        id: 'emergency_contact_name',
        name: 'emergency_contact_name',
        label: 'Emergency Contact Name',
        description: 'Name of emergency contact',
        type: 'text',
        category: 'resident',
        example: 'Robert Doe'
      },
      {
        id: 'emergency_contact_phone',
        name: 'emergency_contact_phone',
        label: 'Emergency Contact Phone',
        description: 'Phone number of emergency contact',
        type: 'phone',
        category: 'resident',
        example: '(555) 111-2222'
      }
    ]
  },
  {
    id: 'property',
    name: 'Property',
    description: 'Information about the property',
    fields: [
      {
        id: 'property_name',
        name: 'property_name',
        label: 'Property Name',
        description: 'Name of the property',
        type: 'text',
        category: 'property',
        example: 'Sunset Apartments'
      },
      {
        id: 'property_address',
        name: 'property_address',
        label: 'Property Address',
        description: 'Full address of the property',
        type: 'address',
        category: 'property',
        example: '456 Oak Street, Springfield, IL 62701'
      },
      {
        id: 'property_city',
        name: 'property_city',
        label: 'Property City',
        description: 'City where the property is located',
        type: 'text',
        category: 'property',
        example: 'Springfield'
      },
      {
        id: 'property_state',
        name: 'property_state',
        label: 'Property State',
        description: 'State where the property is located',
        type: 'text',
        category: 'property',
        example: 'Illinois'
      },
      {
        id: 'property_zip',
        name: 'property_zip',
        label: 'Property ZIP Code',
        description: 'ZIP code of the property',
        type: 'text',
        category: 'property',
        example: '62701'
      },
      {
        id: 'unit_number',
        name: 'unit_number',
        label: 'Unit Number',
        description: 'Unit or apartment number',
        type: 'text',
        category: 'property',
        example: '2B'
      },
      {
        id: 'unit_type',
        name: 'unit_type',
        label: 'Unit Type',
        description: 'Type of unit (studio, 1BR, 2BR, etc.)',
        type: 'text',
        category: 'property',
        example: '2 Bedroom'
      },
      {
        id: 'unit_square_feet',
        name: 'unit_square_feet',
        label: 'Unit Square Feet',
        description: 'Square footage of the unit',
        type: 'number',
        category: 'property',
        example: '850'
      }
    ]
  },
  {
    id: 'lease',
    name: 'Lease',
    description: 'Information about the lease agreement',
    fields: [
      {
        id: 'lease_start_date',
        name: 'lease_start_date',
        label: 'Lease Start Date',
        description: 'Start date of the lease',
        type: 'date',
        category: 'lease',
        example: '01/01/2024'
      },
      {
        id: 'lease_end_date',
        name: 'lease_end_date',
        label: 'Lease End Date',
        description: 'End date of the lease',
        type: 'date',
        category: 'lease',
        example: '12/31/2024'
      },
      {
        id: 'lease_term_months',
        name: 'lease_term_months',
        label: 'Lease Term (Months)',
        description: 'Length of lease in months',
        type: 'number',
        category: 'lease',
        example: '12'
      },
      {
        id: 'monthly_rent',
        name: 'monthly_rent',
        label: 'Monthly Rent',
        description: 'Monthly rent amount',
        type: 'currency',
        category: 'lease',
        example: '$1,200.00'
      },
      {
        id: 'security_deposit',
        name: 'security_deposit',
        label: 'Security Deposit',
        description: 'Security deposit amount',
        type: 'currency',
        category: 'lease',
        example: '$1,200.00'
      },
      {
        id: 'pet_deposit',
        name: 'pet_deposit',
        label: 'Pet Deposit',
        description: 'Pet deposit amount',
        type: 'currency',
        category: 'lease',
        example: '$300.00'
      },
      {
        id: 'move_in_date',
        name: 'move_in_date',
        label: 'Move-in Date',
        description: 'Date tenant moves in',
        type: 'date',
        category: 'lease',
        example: '01/01/2024'
      },
      {
        id: 'move_out_date',
        name: 'move_out_date',
        label: 'Move-out Date',
        description: 'Date tenant moves out',
        type: 'date',
        category: 'lease',
        example: '12/31/2024'
      },
      {
        id: 'rent_due_date',
        name: 'rent_due_date',
        label: 'Rent Due Date',
        description: 'Day of month rent is due',
        type: 'number',
        category: 'lease',
        example: '1'
      }
    ]
  },
  {
    id: 'vendor',
    name: 'Vendor/Contractor',
    description: 'Information about vendors and contractors',
    fields: [
      {
        id: 'vendor_name',
        name: 'vendor_name',
        label: 'Vendor Name',
        description: 'Name of the vendor or contractor',
        type: 'text',
        category: 'vendor',
        example: 'ABC Maintenance Co.'
      },
      {
        id: 'vendor_contact_name',
        name: 'vendor_contact_name',
        label: 'Vendor Contact Name',
        description: 'Primary contact person at vendor',
        type: 'text',
        category: 'vendor',
        example: 'Mike Johnson'
      },
      {
        id: 'vendor_email',
        name: 'vendor_email',
        label: 'Vendor Email',
        description: 'Email address of the vendor',
        type: 'email',
        category: 'vendor',
        example: 'mike@abcmaintenance.com'
      },
      {
        id: 'vendor_phone',
        name: 'vendor_phone',
        label: 'Vendor Phone',
        description: 'Phone number of the vendor',
        type: 'phone',
        category: 'vendor',
        example: '(555) 444-3333'
      },
      {
        id: 'vendor_license',
        name: 'vendor_license',
        label: 'Vendor License',
        description: 'License number of the vendor',
        type: 'text',
        category: 'vendor',
        example: 'LIC123456'
      },
      {
        id: 'vendor_specialty',
        name: 'vendor_specialty',
        label: 'Vendor Specialty',
        description: 'Type of services provided',
        type: 'text',
        category: 'vendor',
        example: 'HVAC Repair'
      }
    ]
  },
  {
    id: 'timestamps',
    name: 'Dates & Timestamps',
    description: 'Current date and time fields',
    fields: [
      {
        id: 'current_date',
        name: 'current_date',
        label: 'Current Date',
        description: 'Today\'s date',
        type: 'date',
        category: 'timestamps',
        example: '03/15/2024'
      },
      {
        id: 'current_time',
        name: 'current_time',
        label: 'Current Time',
        description: 'Current time',
        type: 'text',
        category: 'timestamps',
        example: '2:30 PM'
      },
      {
        id: 'current_datetime',
        name: 'current_datetime',
        label: 'Current Date & Time',
        description: 'Current date and time',
        type: 'text',
        category: 'timestamps',
        example: '03/15/2024 2:30 PM'
      },
      {
        id: 'current_year',
        name: 'current_year',
        label: 'Current Year',
        description: 'Current year',
        type: 'number',
        category: 'timestamps',
        example: '2024'
      },
      {
        id: 'current_month',
        name: 'current_month',
        label: 'Current Month',
        description: 'Current month name',
        type: 'text',
        category: 'timestamps',
        example: 'March'
      },
      {
        id: 'document_created_date',
        name: 'document_created_date',
        label: 'Document Created Date',
        description: 'Date this document was created',
        type: 'date',
        category: 'timestamps',
        example: '03/15/2024'
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial',
    description: 'Financial and payment information',
    fields: [
      {
        id: 'late_fee',
        name: 'late_fee',
        label: 'Late Fee',
        description: 'Late fee amount',
        type: 'currency',
        category: 'financial',
        example: '$50.00'
      },
      {
        id: 'application_fee',
        name: 'application_fee',
        label: 'Application Fee',
        description: 'Application fee amount',
        type: 'currency',
        category: 'financial',
        example: '$75.00'
      },
      {
        id: 'admin_fee',
        name: 'admin_fee',
        label: 'Admin Fee',
        description: 'Administrative fee amount',
        type: 'currency',
        category: 'financial',
        example: '$100.00'
      },
      {
        id: 'total_move_in_cost',
        name: 'total_move_in_cost',
        label: 'Total Move-in Cost',
        description: 'Total amount due at move-in',
        type: 'currency',
        category: 'financial',
        example: '$2,500.00'
      },
      {
        id: 'prorated_rent',
        name: 'prorated_rent',
        label: 'Prorated Rent',
        description: 'Prorated rent amount',
        type: 'currency',
        category: 'financial',
        example: '$400.00'
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Maintenance and work order information',
    fields: [
      {
        id: 'work_order_number',
        name: 'work_order_number',
        label: 'Work Order Number',
        description: 'Work order reference number',
        type: 'text',
        category: 'maintenance',
        example: 'WO-2024-001'
      },
      {
        id: 'maintenance_type',
        name: 'maintenance_type',
        label: 'Maintenance Type',
        description: 'Type of maintenance request',
        type: 'text',
        category: 'maintenance',
        example: 'HVAC Repair'
      },
      {
        id: 'maintenance_description',
        name: 'maintenance_description',
        label: 'Maintenance Description',
        description: 'Description of maintenance issue',
        type: 'text',
        category: 'maintenance',
        example: 'Air conditioning not cooling properly'
      },
      {
        id: 'maintenance_cost',
        name: 'maintenance_cost',
        label: 'Maintenance Cost',
        description: 'Cost of maintenance work',
        type: 'currency',
        category: 'maintenance',
        example: '$250.00'
      },
      {
        id: 'scheduled_date',
        name: 'scheduled_date',
        label: 'Scheduled Date',
        description: 'Date maintenance is scheduled',
        type: 'date',
        category: 'maintenance',
        example: '03/20/2024'
      },
      {
        id: 'completion_date',
        name: 'completion_date',
        label: 'Completion Date',
        description: 'Date maintenance was completed',
        type: 'date',
        category: 'maintenance',
        example: '03/20/2024'
      }
    ]
  }
];

export class MergeFieldsService {
  private static instance: MergeFieldsService;
  private categories: MergeFieldCategory[] = MERGE_FIELD_CATEGORIES;

  public static getInstance(): MergeFieldsService {
    if (!MergeFieldsService.instance) {
      MergeFieldsService.instance = new MergeFieldsService();
    }
    return MergeFieldsService.instance;
  }

  getAllCategories(): MergeFieldCategory[] {
    return this.categories;
  }

  getCategory(categoryId: string): MergeFieldCategory | undefined {
    return this.categories.find(cat => cat.id === categoryId);
  }

  getAllFields(): MergeField[] {
    return this.categories.flatMap(category => category.fields);
  }

  getFieldsByCategory(categoryId: string): MergeField[] {
    const category = this.getCategory(categoryId);
    return category ? category.fields : [];
  }

  getField(fieldId: string): MergeField | undefined {
    return this.getAllFields().find(field => field.id === fieldId);
  }

  searchFields(query: string): MergeField[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllFields().filter(field =>
      field.name.toLowerCase().includes(lowercaseQuery) ||
      field.label.toLowerCase().includes(lowercaseQuery) ||
      field.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  getFieldsForDocumentType(documentType: string): MergeField[] {
    // Define which fields are relevant for different document types
    const documentTypeMapping: Record<string, string[]> = {
      'lease': ['operator', 'resident', 'property', 'lease', 'financial', 'timestamps'],
      'service': ['operator', 'vendor', 'property', 'financial', 'timestamps'],
      'maintenance': ['operator', 'resident', 'vendor', 'property', 'maintenance', 'timestamps'],
      'vendor': ['operator', 'vendor', 'property', 'financial', 'timestamps'],
      'notice': ['operator', 'resident', 'property', 'lease', 'timestamps'],
      'renewal': ['operator', 'resident', 'property', 'lease', 'financial', 'timestamps']
    };

    const relevantCategories = documentTypeMapping[documentType] || ['timestamps'];
    return this.categories
      .filter(category => relevantCategories.includes(category.id))
      .flatMap(category => category.fields);
  }

  formatFieldValue(field: MergeField, value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    switch (field.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(parseFloat(value) || 0);
      
      case 'date':
        if (typeof value === 'string') {
          const date = new Date(value);
          return date.toLocaleDateString('en-US');
        }
        return value.toString();
      
      case 'phone':
        // Format as (XXX) XXX-XXXX
        const cleaned = value.toString().replace(/\D/g, '');
        if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return value.toString();
      
      case 'email':
        return value.toString().toLowerCase();
      
      default:
        return value.toString();
    }
  }

  populateTemplate(template: string, data: Record<string, any>): string {
    let populatedTemplate = template;
    
    this.getAllFields().forEach(field => {
      const placeholder = `{{${field.name}}}`;
      const value = data[field.name];
      
      if (value !== undefined && value !== null) {
        const formattedValue = this.formatFieldValue(field, value);
        populatedTemplate = populatedTemplate.replace(new RegExp(placeholder, 'g'), formattedValue);
      }
    });

    // Handle current date/time fields
    const now = new Date();
    const currentDateReplacements = {
      '{{current_date}}': now.toLocaleDateString('en-US'),
      '{{current_time}}': now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      '{{current_datetime}}': `${now.toLocaleDateString('en-US')} ${now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`,
      '{{current_year}}': now.getFullYear().toString(),
      '{{current_month}}': now.toLocaleDateString('en-US', { month: 'long' }),
      '{{document_created_date}}': now.toLocaleDateString('en-US')
    };

    Object.entries(currentDateReplacements).forEach(([placeholder, value]) => {
      populatedTemplate = populatedTemplate.replace(new RegExp(placeholder, 'g'), value);
    });

    return populatedTemplate;
  }

  validateMergeFields(template: string): { valid: boolean; unknownFields: string[] } {
    const fieldPlaceholders = template.match(/\{\{([^}]+)\}\}/g) || [];
    const unknownFields: string[] = [];
    const allFieldNames = this.getAllFields().map(field => field.name);

    fieldPlaceholders.forEach(placeholder => {
      const fieldName = placeholder.replace(/\{\{|\}\}/g, '');
      if (!allFieldNames.includes(fieldName)) {
        unknownFields.push(fieldName);
      }
    });

    return {
      valid: unknownFields.length === 0,
      unknownFields
    };
  }
}

export const mergeFieldsService = MergeFieldsService.getInstance();
