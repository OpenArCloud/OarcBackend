export default {
    name: 'organizationattribute',
    title: 'Organizational attribute',
    type: 'document',
    fields: [
      {
        name: 'attributename',
        title: 'Attribute name',
        type: 'string'
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text'
      }
    ],
    preview: {
      select: {
        title: 'attributename',
        subtitle: 'description'
      }
    }
  }
  