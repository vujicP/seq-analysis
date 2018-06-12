import axios from 'axios'


const defaults = {
  baseURL: 'http://localhost:8000/api/res/',
  transformResponse: (response) => {
    if(response === "") return response;
    var json_response = JSON.parse(response);
    return json_response.hasOwnProperty('objects') 
              ? JSON.parse(json_response.objects[0].data) 
              : JSON.parse(json_response.data)
    }
}


Object.assign(axios.defaults, defaults)

export const fetchAllDatadocs = () => {
  return axios.get('/datadoc').catch((error) => Promise.reject(error))
}

export const fetchDatadoc = (attribute) => {
  return axios.get(`/datadoc/${attribute}`).catch((error) => Promise.reject(error))
}

export const fetchSequences = (name) => {
  return axios.get(`/sequence/${name}`).catch((error) => Promise.reject(error))
}

export const fetchSteps = (name) => {
  return axios.get(`/step/${name}`).catch((error) => Promise.reject(error))
}

export const fetchInterpretations = (name, step_id) => {
  return axios.get(`/interpretation/${name}/${step_id}`).catch((error) => Promise.reject(error))
}

export const fetchCodes = (name) => {
  return axios.get('/code').catch((error) => Promise.reject(error))
}

export const fetchConcepts = (name) => {
  return axios.get('/concept').catch((error) => Promise.reject(error))
}

export const fetchAbstractions = (intid) => {
  return axios.get(`/concept/${intid}`).catch((error) => Promise.reject(error))
}


export const postDataDoc = (params) => {
  return axios.post('/datadoc/', params).catch((error) => Promise.reject(error))
}

export const postStep = (params) => {
  return axios.post('/step/', params).catch((error) => Promise.reject(error))
}

export const postInterpretation = (params) => {
  return axios.post('/interpretation/', params).catch((error) => Promise.reject(error))
}

export const postAbstraction = (params) => {
  return axios.post('/concept/', params).catch((error) => Promise.reject(error))
}

export const postCodeConnection = (params) => {
  return axios.post('/code/', params).catch((error) => Promise.reject(error))
}

export const createSequencesForDataDoc = (name) => {
  return axios.post('/sequence/', {"datadoc": name}).catch((error) => Promise.reject(error))
}

export const deleteCodeConnection = (id) => {

  var params = {
    relid: id,
    delete: true
  }

  return axios.post('/code/', params).catch((error) => Promise.reject(error))
}

export const deleteCode = (codeid, intid) => {

    var params = {
    codeid: codeid,
    intid: intid,
    delete: true
  }
 
  return axios.post('/code/', params).catch((error) => Promise.reject(error))
}




