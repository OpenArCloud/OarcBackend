export default {
    name: 'person',
    title: 'Person',
    type: 'document',
    fields: [
      {
        name: 'firstname',
        title: 'First name',
        type: 'string'
      },
      {
        name: 'lastname',
        title: 'Last name',
        type: 'string'
      },      
      {
        title: 'Year of birth',
        name: 'yearofbirth',
        type: 'number',
        validation: Rule => Rule.min(1900).max(3000).integer().warning('Invalid year')
      },
      {
        name: 'streetaddress',
        title: 'Street address',
        type: 'string'
      },
      {
        name: 'city',
        title: 'City',
        type: 'string'
      },
      {
        name: 'country',
        title: 'Country',
        type: 'string'
      },
      {
        name: 'roleortitle',
        title: 'Title or role',
        type: 'string'
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string'
      },
      {
        name: 'organizations',
        title: 'Organizations',
        type: 'array',
        of: [{type: 'reference', to: {type: 'organization'}}]
      },
      {
        name: 'attributes',
        title: 'Person is',
        type: 'array',
        of: [{type: 'reference', to: {type: 'personattribute'}}]
      },
    ],
    preview: {
      select: {
        title: 'firstname',
        subtitle: 'lastname'
      }
    }
}