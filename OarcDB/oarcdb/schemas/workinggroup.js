export default {
    name: 'workinggroup',
    title: 'Working group',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name of workin group',
            type: 'string'
        },
        {
            name: 'leader',
            title: 'Leader of the working group',
            type: 'reference',
            to: {type: 'person'}
        },
        {
            name: 'wgmembers',
            title: 'Members of workinggroup',
            type: 'array',
            of: [{type: 'reference', to: {type: 'person'}}]
        },
        {
          name: 'description',
          title: 'Desctiption of workinggroup ',
          type: 'text'
        },
        {
          name: 'starteddate',
          title: 'Date when workinggroup started',
          type: 'date'
        },
        {
          name: 'founding',
          title: 'Is a Founding Partner ',
          type: 'boolean'
        }
  
    ]
  }