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
            name: 'wgc',
            title: 'Working Group Council (WGC)',
            type: 'wgc'
        },
        {
            name: 'wgmembers',
            title: 'Members of workinggroup',
            type: 'array',
            of: [{type: 'reference', to: {type: 'member'}}]
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
        }
  
    ]
  }