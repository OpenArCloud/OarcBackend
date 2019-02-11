export default {
    name: 'emailsubscriber',
    title: 'Subscriber to OARC news and updates',
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
            name: 'email',
            title: 'Email',
            type: 'string'
        },     
        {
            name: 'message',
            title: 'Message',
            type: 'string'
        },
        {
            name: 'utctimestamp',
            title: 'Timestamp UTC',
            type: 'number'
        }

    ]
}