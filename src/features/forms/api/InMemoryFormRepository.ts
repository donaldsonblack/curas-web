import type { FormRepository } from './FormRepository';
import type { FormDefinition, Submission } from '../domain/formTypes';

export class InMemoryFormRepository implements FormRepository {
  private forms: Map<string, FormDefinition> = new Map();
  private submissions: Map<string, Submission> = new Map();

  constructor() {
    // Seed with demo form
    this.seedDemoForm();
  }

  private seedDemoForm(): void {
    const demoForm: FormDefinition = {
      id: 'demo-form-1',
      title: 'Product Interest Survey',
      intro: 'Help us understand your needs better by filling out this quick survey.',
      submitText: 'Submit Survey',
      success: {
        mode: 'message',
        message: 'Thanks—submission recorded. We\'ll be in touch soon!'
      },
      allowAnonymous: true,
      backingCollectionId: 'survey-responses',
      properties: [
        {
          id: 'name-field',
          key: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true
        },
        {
          id: 'email-field',
          key: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'your.email@company.com',
          required: true
        },
        {
          id: 'plan-field',
          key: 'plan',
          type: 'select',
          label: 'Which plan interests you?',
          required: true,
          options: [
            { id: 'free-option', label: 'Free', value: 'free' },
            { id: 'pro-option', label: 'Pro', value: 'pro' },
            { id: 'business-option', label: 'Business', value: 'business' }
          ]
        },
        {
          id: 'team-size-field',
          key: 'teamSize',
          type: 'number',
          label: 'Team Size',
          placeholder: 'How many people are on your team?',
          required: false
        },
        {
          id: 'company-field',
          key: 'company',
          type: 'text',
          label: 'Company Name',
          placeholder: 'Your company name',
          required: false
        }
      ],
      visibility: [
        {
          fieldId: 'team-size-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'includes',
                  value: 'pro'
                }
              ]
            },
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'includes',
                  value: 'business'
                }
              ]
            }
          ]
        },
        {
          fieldId: 'company-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'includes',
                  value: 'pro'
                }
              ]
            },
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'includes',
                  value: 'business'
                }
              ]
            }
          ]
        }
      ],
      automations: [
        {
          type: 'notify',
          channel: 'email',
          to: 'sales@company.com',
          template: 'New survey submission from {{name}}'
        }
      ]
    };

    this.forms.set(demoForm.id, demoForm);
  }

  async getForm(formId: string): Promise<FormDefinition> {
    const form = this.forms.get(formId);
    if (!form) {
      throw new Error(`Form with id ${formId} not found`);
    }
    // Return a deep copy to prevent mutations
    return JSON.parse(JSON.stringify(form));
  }

  async saveForm(def: FormDefinition): Promise<void> {
    // Store a deep copy to prevent mutations
    this.forms.set(def.id, JSON.parse(JSON.stringify(def)));
  }

  async listForms(): Promise<Pick<FormDefinition, 'id' | 'title'>[]> {
    return Array.from(this.forms.values()).map(form => ({
      id: form.id,
      title: form.title
    }));
  }

  async createSubmission(sub: Submission): Promise<{ id: string }> {
    const submissionId = `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the submission
    this.submissions.set(submissionId, {
      ...sub,
      meta: {
        ...sub.meta,
        ts: Date.now()
      }
    });

    // Simulate processing automations
    const form = await this.getForm(sub.formId);
    if (form.automations) {
      for (const automation of form.automations) {
        console.log('Processing automation:', automation);
        // In a real implementation, this would trigger actual automations
      }
    }

    return { id: submissionId };
  }

  // Additional methods for demo/testing
  getSubmissions(): Submission[] {
    return Array.from(this.submissions.values());
  }

  clearSubmissions(): void {
    this.submissions.clear();
  }
}
