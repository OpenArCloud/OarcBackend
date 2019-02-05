export default {
    name: 'personattribute',
    title: 'Person attribute',
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
  