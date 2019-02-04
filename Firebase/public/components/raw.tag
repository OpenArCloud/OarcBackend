<raw>
  <script>
    // custom tags are parsed and mounted 
    // when the 'raw' component is first mounted
    this.root.innerHTML = opts.html

    // ...however when setting innerHTML after an update
    // any custom tags are not parsed and mounted
    this.on('update', () => {
      this.root.innerHTML = opts.html
    })
  </script>
</raw>