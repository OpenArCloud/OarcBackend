export default {
    name: 'person',
    title: 'Person',
    type: 'object',
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
        name: 'portrait',
        title: 'Portrait picture',
        type: 'image'
      },
      {
        name: 'streetaddress',
        title: 'Street address',
        type: 'string'
      },
      {
        name: 'postcodeorzip',
        title: 'Postcode / ZIP',
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
        name: 'jobtitleorrole',
        title: 'Job title or role',
        type: 'string'
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string'
      },
      {
        name: 'organizations',
        title: 'Organization / Workplace',
        type: 'string'
      }
    ],
    preview: {
      select: {
        media: 'portrait',
        title: 'firstname',
        subtitle: 'lastname'
      }
    }
}
