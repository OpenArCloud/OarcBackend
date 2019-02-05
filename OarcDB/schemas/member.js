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
            name: 'membersincedate',
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
            name: 'lastpaymenttimestamp',
            title: 'When was last fee payment made?',
            type: 'date'
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