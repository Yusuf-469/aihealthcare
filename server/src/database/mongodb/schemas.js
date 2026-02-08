// MongoDB Schemas for Medical Reports
// Using Mongoose-like schema definitions

const medicalReportSchema = {
  schemaName: 'MedicalReport',
  collection: 'medical_reports',
  fields: {
    userId: {
      type: 'UUID',
      required: true,
      index: true
    },
    filePath: {
      type: 'String',
      required: true
    },
    fileName: {
      type: 'String',
      required: true
    },
    mimeType: {
      type: 'String',
      enum: ['application/pdf', 'image/jpeg', 'image/png', 'image/dicom']
    },
    reportType: {
      type: 'String',
      enum: ['blood_test', 'xray', 'mri', 'ct_scan', 'prescription', 'general'],
      default: 'general'
    },
    uploadDate: {
      type: 'Date',
      default: Date.now
    },
    aiAnalysis: {
      status: {
        type: 'String',
        enum: ['pending', 'processing', 'complete', 'error'],
        default: 'pending'
      },
      overallStatus: {
        type: 'String',
        enum: ['normal', 'attention_needed', 'critical']
      },
      summary: {
        type: 'String'
      },
      confidence: {
        type: 'Number',
        min: 0,
        max: 1
      },
      flaggedValues: [{
        name: 'String',
        value: 'String',
        unit: 'String',
        normalRange: 'String',
        status: {
          type: 'String',
          enum: ['low', 'normal', 'high']
        },
        explanation: 'String',
        severity: {
          type: 'String',
          enum: ['low', 'medium', 'high']
        }
      }],
      recommendations: ['String'],
      rawText: 'String',
      processedAt: 'Date'
    },
    metadata: {
      originalFileSize: 'Number',
      scanResolution: 'String',
      pageCount: 'Number'
    },
    createdAt: {
      type: 'Date',
      default: Date.now
    },
    updatedAt: {
      type: 'Date',
      default: Date.now
    }
  },
  indexes: [
    { fields: { userId: 1, uploadDate: -1 } },
    { fields: { reportType: 1 } },
    { fields: { 'aiAnalysis.status': 1 } }
  ]
}

const reportTrendSchema = {
  schemaName: 'ReportTrend',
  collection: 'report_trends',
  fields: {
    userId: {
      type: 'UUID',
      required: true,
      index: true
    },
    metricName: {
      type: 'String',
      required: true
    },
    reports: [{
      reportId: 'UUID',
      value: 'Number',
      unit: 'String',
      date: 'Date',
      status: 'String'
    }],
    trend: {
      direction: {
        type: 'String',
        enum: ['increasing', 'decreasing', 'stable']
      },
      percentChange: 'Number',
      analysis: 'String'
    },
    createdAt: {
      type: 'Date',
      default: Date.now
    }
  },
  indexes: [
    { fields: { userId: 1, metricName: 1 } }
  ]
}

// Sample normalized ranges for common blood tests
const normalRanges = {
  hemoglobin: {
    male: { min: 13.5, max: 17.5, unit: 'g/dL' },
    female: { min: 12.0, max: 15.5, unit: 'g/dL' }
  },
  wbc: {
    adult: { min: 4.5, max: 11.0, unit: '10³/µL' }
  },
  platelets: {
    adult: { min: 150, max: 400, unit: '10³/µL' }
  },
  glucose_fasting: {
    adult: { min: 70, max: 100, unit: 'mg/dL' }
  },
  glucose_hba1c: {
    adult: { min: 4.0, max: 5.6, unit: '%' }
  },
  cholesterol_total: {
    adult: { min: 0, max: 200, unit: 'mg/dL' }
  },
  cholesterol_ldl: {
    adult: { min: 0, max: 100, unit: 'mg/dL' }
  },
  cholesterol_hdl: {
    adult: { min: 40, max: 60, unit: 'mg/dL' }
  },
  triglycerides: {
    adult: { min: 0, max: 150, unit: 'mg/dL' }
  },
  creatinine: {
    male: { min: 0.7, max: 1.3, unit: 'mg/dL' },
    female: { min: 0.6, max: 1.1, unit: 'mg/dL' }
  },
  alt: {
    adult: { min: 7, max: 56, unit: 'U/L' }
  },
  ast: {
    adult: { min: 10, max: 40, unit: 'U/L' }
  }
}

export { 
  medicalReportSchema, 
  reportTrendSchema,
  normalRanges 
}
