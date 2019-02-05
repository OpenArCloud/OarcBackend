export default {
    name: 'wgc',
    title: 'Working Group Council',
    type: 'object',
    fields: [
        {
          name: 'chair',
          title: 'Chair',
          type: 'reference',
          to: {type: 'member'}
        },
        {
            name: 'cochair',
            title: 'Co-chair',
            type: 'reference',
            to: {type: 'member'}
        },
        {
            name: 'secretary',
            title: 'Secretary',
            type: 'reference',
            to: {type: 'member'}
        },
        {
            name: 'councilmembers',
            title: 'Members of Working Group Council',
            type: 'array',
            of: [{type: 'reference', to: {type: 'member'}}]
        }
    ]
}