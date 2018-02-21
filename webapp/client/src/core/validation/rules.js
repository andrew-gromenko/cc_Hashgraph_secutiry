export var GroupRules = {
  name: [
    v => !!v || 'Name is required',
    v => (v && v.length <= 20) || 'Name must be less than 20 characters'
  ]
}

export var FileRules = {
  name: [
    v => !!v || 'Name is required',
    v => (v && v.length <= 20) || 'Name must be less than 20 characters'
  ],
  file: [
    v => !!v || 'File is required'
  ]
}

export var UserRules = {
  name: [
    v => !!v || 'Name is required',
    v => (v && v.length > 3) || 'Name must be more than 3 characters',
    v => (v && v.length <= 20) || 'Name must be less than 20 characters'
  ],
  password: [
    v => !!v || 'Password is required',
    v => (v && v.length > 6) || 'Password must be more than 6 characters'
  ]
}
