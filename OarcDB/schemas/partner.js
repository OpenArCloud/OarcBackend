export default {
    name: 'partner',
    title: 'OARC partner',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name of organization',
        type: 'string'
      },
      {
        name: 'website',
        title: 'Website',
        type: 'string'
      },
      {
          name: 'contactperson',
          title: 'Contact person',
          type: 'person'
      },
      {
        name: 'alternatecontact',
        title: 'Alternate contact person',
        type: 'person'
      },
      {
        name: 'financialcontact',
        title: 'Financial contact person',
        type: 'person'
      },
      {
        name: 'logo',
        title: 'Logo',
        type: 'image'
      },
      {
        name: 'founding',
        title: 'Is a Founding Partner ',
        type: 'boolean'
      },

      {
        name: 'endorsement',
        title: 'Endorsment of OARC ',
        type: 'text'
      },
      {
        name: 'joinedate',
        title: 'Partnership joined date ',
        type: 'date'
      },
    ]
  }