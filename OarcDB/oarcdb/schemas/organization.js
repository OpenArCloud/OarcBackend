export default {
    name: 'organization',
    title: 'Organization',
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
          type: 'reference',
          to: {type: 'person'}
      },
      {
        name: 'logo',
        title: 'Logo',
        type: 'image'
      },
      {
        name: 'attributes',
        title: 'Organization is',
        type: 'array',
        of: [{type: 'reference', to: {type: 'organizationattribute'}}]
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