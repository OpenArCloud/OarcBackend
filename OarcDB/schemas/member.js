export default {
    name: 'member',
    title: 'OARC member',
    type: 'document',
    fields: [
        {
            name: 'membertype',
            title: 'Type of member',
            type: 'string',
            options: {
                list: [
                    {title: 'Professional', value: 'professional'},
                    {title: 'Student/part-time/other', value: 'studentparttimeother'}
                ], 
                layout: 'radio' // <-- defaults to 'dropdown'
            }
        
        },
        {
            name:'personaldetails',
            title:'Personal details',
            type:'person'
        },
        {
            name: 'membershipstartdate',
            title: 'Date when person became member',
            type: 'date'
        },
        {
            name: 'founding',
            title: 'Is a Founding Member ',
            type: 'boolean'
        },
        {
            name: 'hasPaid',
            title: 'Member has paid the fee',
            type: 'boolean'
        },
        {
            name: 'lastpaymentdate',
            title: 'When was last fee payment made?',
            type: 'date'
        },
        {
            name: 'approved',
            title: 'OARC has approved this membership',
            type: 'boolean'
        }

    ],
    preview: {
        select: {
            media: 'personaldetails.portrait',
            title: 'personaldetails.firstname',
            subtitle: 'personaldetails.lastname'
        }
      }
}