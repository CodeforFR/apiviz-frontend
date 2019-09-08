
console.log('+ + + plugins/utils... ')

import axios from 'axios'
const CancelToken = axios.CancelToken
const source = CancelToken.source()

// feature test for AbortController that works in Safari 12
let abortableFetchSupported = false;

try{
  const ac = new AbortController()

  fetch('.', {signal: ac.signal})
  .then(r => r.text())
  .then(result => {
    abortableFetchSupported = false;
  })
  .catch(err => {
    abortableFetchSupported = err.name === 'AbortError'
  })

  ac.abort();
}
catch(e){
  abortableFetchSupported = false;
}

// choose error template if needed
export function chooseTemplate(templates, locale){
  if (templates) {
    let template = templates.find(t => {
      return t.locale === locale
    })
    return template.url
  } else {
    return "https://raw.githubusercontent.com/co-demos/structure/master/pages-html/tools-fr.html"
  }
}

// To load external librairies in components
export function loadScript(url, type, script_id, callback){

  // console.log("loadScript / script_id :", script_id);
  // console.log("loadScript / url :", url);

  var script = document.createElement('script');
  script.src = url;
  script.id = script_id;

  if (type !== undefined ){
    script.type = "text/javascript";
  }
  
  if (callback !== undefined){
    script.onreadystatechange = callback;
    script.onload = callback;
  }

  document.head.appendChild(script);
}

export function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

export function deleteScript(script_id){

  try {
    // console.log("deleteScript / script_id :", script_id);
    var elem = document.getElementById(script_id)
    // console.log("deleteScript / elem:", elem);
  
    elem.parentNode.removeChild(elem)
  } catch(error) {
    console.log("deleteScript / error:", error);
  }

}

// To activate carousels from components
export function activateCarousel(slidesNumber=2, isInfinite=true, hasPagination=false){
  console.log("activate carousel from utils")
  var carousels = bulmaCarousel.attach('.carousel', {
    // TODO: give the parameters as args?
    slidesToShow: 2,
    infinite: true,
    pagination: false

    // slidesToShow: slidesNumber,
    // infinite: isInfinite,
    // pagination: hasPagination
  });

  // "hacky" way to get custom icons
  document.getElementsByClassName("slider-navigation-previous")[0].childNodes[0].remove();
  document.getElementsByClassName("slider-navigation-next")[0].childNodes[0].remove();
}

export function activateBulmaExtension(extension, pointer, options){
  console.log("plugins / utils / activate extension from utils")
  console.log("plugins / utils / activate extension from utils / options : \n", options)
  let bulmaExtension = extension.attach( pointer, options) 
  console.log("plugins / utils / activate extension from utils / bulmaExtension : \n", bulmaExtension)
  return bulmaExtension
}

// SEARCH RELATED

// TO DO => COMMENT ALL THAT SHIT / getItemById
// server-side end-point to get only one project
export function getItemById(id, endpointConfig, userAccessToken, endpointAuthConfig){

  // const url = searchEnpointCreator({
  //   page:1,
  //   per_page:1,
  //   baseUrl:root_url,
  //   item_id:id
  // })
  console.log("\nPL-getItemById ..." )
  console.log("\PL-getItemById / endpointConfig : ", endpointConfig )

  const endPointUrlAndPayload = searchEndpointGenerator({
    endpointConfig : endpointConfig,
    questionParams : { itemId : id },
    selectedFilters : [],
    authConfig : endpointAuthConfig,
    accesToken : userAccessToken
  })
  let url = endPointUrlAndPayload.requestUrl
  console.log("\PL-getItemById / url : ", url )

  let payload = endPointUrlAndPayload.requestPayload
  console.log("\PL-getItemById / payload : ", payload )

  return fetch( url )
  .then(r => r.json())
  .then(({data, query}) =>
    data && data.data_raw && data.data_raw.f_data  && Array.isArray(data.data_raw.f_data)
      ? data.data_raw.f_data[0]
      : undefined
  )
}


// source: https://github.com/jashkenas/underscore/blob/master/underscore.js#L1320
// export function isObject(obj) {
//   var type = typeof obj;
//   return type === 'function' || type === 'object' && !!obj;
// }

// export function iterationCopy(src) {
//   // let target = new Object()
//   let target = {}
//   for (let prop in src) {
//     if (src.hasOwnProperty(prop)) {
//       // if the value is a nested object, recursively copy all it's properties
//       if (isObject(src[prop])) {
//         target[prop] = iterationCopy(src[prop])
//       } else {
//         target[prop] = src[prop]
//       }
//     }
//   }
//   return target;
// }

export const setValueToField = (fields, value) => {
  const reducer = (acc, item, index, arr) => ({ [item]: index + 1 < arr.length ? acc : value });
  return fields.reduceRight(reducer, {});
};

export function setValueToNestedObject(obj, path, value, separator='/') {
  const pList = path.split(separator);
  const key = pList.pop();
  const pointer = pList.reduce((accumulator, currentValue) => {
    if (accumulator[currentValue] === undefined) accumulator[currentValue] = {};
    return accumulator[currentValue];
  }, obj);
  pointer[key] = value;
  return obj;
}

export function objectFromPath( obj, path, separator='/'){

  console.log("+ + + objectFromPath / path : ", path)
  let object 

  if ( path ){

    var properties = Array.isArray(path) ? path : path.split(separator)
    console.log("+ + + objectFromPath / properties : ", properties)

    object = properties.reduce((prev, curr) => prev && prev[curr], obj)
    console.log("+ + + objectFromPath / object : ", object)

  } else {
    object = obj
  }

  return object
} 

// cf : https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
export function resolvePathString( respField , respFieldsPaths, obj=self, separator='/') {

  console.log("\n+ + + resolvePathString / respField : ", respField)
  console.log("+ + + resolvePathString / respFieldsPaths : ", respFieldsPaths)

  try {
    let path = respFieldsPaths[ respField  ].path
  
    // console.log("\n+ + + resolvePathString ... ");
    console.log("+ + + resolvePathString / path : ", path)
    console.log("+ + + resolvePathString / obj : ", obj)
  
    // var properties = Array.isArray(path) ? path : path.split(separator)
    // console.log("+ + + resolvePathString / properties : ", properties);
    // let dataObject = properties.reduce((prev, curr) => prev && prev[curr], obj)
    let dataObject = objectFromPath( obj, path, separator )

    return dataObject
  } 
  catch {
    return {}
  }

}

// export function searchItems( url=undefined, responsePaths=undefined, endpointRawConfig=undefined ){
export function searchItems( endpointGenerated=undefined, endpointRawConfig=undefined ){

  console.log("\n+ + + searchItems ... ")
  console.log("+ + + searchItems / endpointGenerated : ", endpointGenerated)
  console.log("+ + + searchItems / endpointRawConfig : ", endpointRawConfig)

  let methodsWithPayload = [ "POST", "PUT", "PATCH" ]
  let fetchMethod = endpointRawConfig.method
  console.log("+ + + searchItems / fetchMethod : ", fetchMethod)

  let fetchHeader = endpointGenerated.requestHeader
  // let fetchHeader = {
  //   'Accept': 'application/json',
  //   'Content-Type': 'application/json',
  //   // "Access-Control-Allow-Origin" : "*",
  // }
  console.log("+ + + searchItems / fetchHeader : ", fetchHeader)

  let fetchUrl = endpointGenerated.requestUrl
  console.log("+ + + searchItems / fetchUrl : ", fetchUrl)

  let fetchPayload = endpointGenerated.requestPayload
  console.log("+ + + searchItems / fetchPayload : ", fetchPayload)

  let responsePaths = endpointRawConfig.resp_fields
  console.log("+ + + searchItems / responsePaths : ", responsePaths)

  // abort fetch if this is supported
  // abort manually when response arrives otherwise
  const ac = abortableFetchSupported ? new AbortController() : undefined
  let searchAborted = false

  // set up fetch options
  let fetchOptions = { 
    method : fetchMethod,
    signal: ac.signal,
    header : fetchHeader
  }
  // set up axios options
  let axiosOptions = {
    url : fetchUrl,
    method : fetchMethod.toLowerCase(),
    header : fetchHeader
  }

  let payloadJson = JSON.stringify( fetchPayload )
  console.log("+ + + searchItems / payloadJson : ", payloadJson)
  if ( methodsWithPayload.includes(fetchMethod) ){
    fetchOptions.body = payloadJson
    // fetchOptions.body = fetchPayload
    axiosOptions.data = payloadJson
  }

  console.log("+ + + searchItems / fetchOptions : ", fetchOptions)
  console.log("+ + + searchItems / axiosOptions : ", axiosOptions)
  console.log("+ + + searchItems / ac : ", ac)

  // try {
    return {
      abort(){
        searchAborted = true
        if( ac )
          ac.abort()
      },
      promise : axios({
        method: fetchMethod.toLowerCase(),
        url: fetchUrl,
        data : payloadJson,
        headers : fetchHeader,
        // headers: {
        //   'Accept' : 'application/json',
        //   'Content-Type' : 'application/json'
        // }
      })
      .then( resp => {
        console.log("+ + + searchItems / (axios) / resp :", resp);
        console.log("+ + + searchItems / (axios) / responsePaths : ", responsePaths);

        let responseProjects = resolvePathString( 'projects', responsePaths, resp.data, '/')
        console.log("+ + + searchItems / (axios) / responseProjects : ", responseProjects);

        let responseTotal = resolvePathString( 'total', responsePaths, resp.data, '/')
        console.log("+ + + searchItems / (axios) / responseProjects : ", responseProjects);

        let responseStats = resolvePathString( 'stats', responsePaths, resp.data, '/')
        console.log("+ + + searchItems / (axios) / responseStats : ", responseStats);

        // TO DO => remap responseStats ...

        let dataStructure = {
          projects : responseProjects,
          stats : responseStats,
          total : responseTotal
        }
        return dataStructure  
      })
      .catch( err => {
        console.log("+ + + searchItems / (axios)  err :", err);
      })
    }
  // }
  // catch(error){
  //   console.log("+ + + searchItems / (axios) error : ", error)
  // }

  /*
  return {
    abort(){
      searchAborted = true
      if( ac )
        ac.abort()
    },
    promise: ( ac ? fetch( fetchUrl, fetchOptions ) : fetch(fetchUrl) )
    // promise: ( ac ? fetch( fetchUrl, fetchOptions ) : fetch(fetchUrl, fetchOptions) )
    // promise : axios( axiosOptions )
    .then(r => r.json())
    .then(( resp ) => {
      console.log("+ + + searchItems / (fetch) / resp :", resp);
      if ( searchAborted ){
        const error = new Error('Search aborted')
        error.name = 'AbortError'
        throw error
      }
      else {
        // read responsePath and populate dataStrcture correspondingly
        console.log("+ + + searchItems / (fetch) / responsePaths : ", responsePaths);
        let responseProjects = resolvePathString( responsePaths.projects.path, resp, '/')
        console.log("+ + + searchItems / (fetch) / responseProjects : ", responseProjects);
        let responseTotal = resolvePathString( responsePaths.total.path, resp, '/')
        let dataStructure = {
          projects : responseProjects,
          total : responseTotal
        }

        return dataStructure

      }
    })
  }
  */

}



export function buildRequestHeader( token, endpointConfigHeaderAuth ){

  console.log("+ + + buildRequestHeader / token : ", token)
  console.log("+ + + buildRequestHeader / endpointConfigHeaderAuth : ", endpointConfigHeaderAuth)
  
  let headers = {}
  // let headers = {
  //   'Accept' : 'application/json',
  //   'Content-Type' : 'application/json',
  //   'Authorization' : ""
  // }
  // let myHeaders = new Headers()

  for (let header_arg of endpointConfigHeaderAuth ){

    // let headerField = header_arg.header_field
    let headerField = header_arg.header_field
    console.log("+ + + buildRequestHeader / headerField : ", headerField)

    let headerVal = header_arg.header_value
    console.log("+ + + buildRequestHeader / headerVal : ", headerVal)

    if ( headerVal && header_arg.app_var_name !== 'token' ) {
      headers[ headerField ] = headerVal
    }

    if ( header_arg.is_var && header_arg.app_var_name === 'token' && token ){
      headers[ headerField ] = header_arg.header_value_prefix + token
      headerVal = header_arg.header_value_prefix + token
    }
    // myHeaders.append( headerField, headerVal )
    // myHeaders[ headerField ] = headerVal 

  }

  // myHeaders.append('Content-Type', 'application/json')

  // console.log("+ + + buildRequestHeader / myHeaders : ", myHeaders)
  // return myHeaders
  
  console.log("+ + + buildRequestHeader / headers : ", headers)
  return headers
}

export function buildRequestPayload( endpointConfig ){

  console.log("+ + + buildRequestPayload / endpointConfig : \n ", endpointConfig)

  // let payloadIsArray = endpointConfig.payload_format === 'list'
  // let payload = payloadIsArray ? [] : {}
  let payload = endpointConfig.payload_queries
  // for (let payloadArg of endpointConfig.payload_args ){
  //   if ( payloadIsArray ) {

  //     let payloadItem = {}
  //     for ( let payloadSubArg of payloadArg ){
  //       let payloadValue = payloadSubArg.payload_value
  //       payloadItem[ payloadSubArg.payload_field ] = payloadValue
  //     }
  //     payload.push( payloadItem )
  //   }
  //   else {
  //     payload[ payloadArg.payload_field ] = payloadArg.payload_value
  //   }
  // }
  return payload 
}

export function searchEndpointGenerator( obj ) {
  if ( !obj ) { throw 'error in searchEndpointGenerator: no parameter defined' }

  console.log("+ + + searchEndpointGenerator / ...")
  console.log("+ + + searchEndpointGenerator / obj : \n ", obj)

  // endpoint config related
  const endpointConfig = obj.endpointConfig
  console.log("+ + + searchEndpointGenerator / endpointConfig : ", endpointConfig)

  const endpointConfigHeaderAuth = obj.authConfig.request_header_auth_options
  console.log("+ + + searchEndpointGenerator / endpointConfigHeaderAuth : ", endpointConfigHeaderAuth)

  const endpointConfigArgs = endpointConfig.args_options
  console.log("+ + + searchEndpointGenerator / endpointConfigArgs : ", endpointConfigArgs)

  let fetchMethod = endpointConfig.method
  console.log("+ + + searchEndpointGenerator / fetchMethod : ", fetchMethod)

  // question related
  const questionParams = obj.questionParams
  console.log("+ + + searchEndpointGenerator / questionParams : ", questionParams)

  const selectedFilters = obj.selectedFilters
  console.log("+ + + searchEndpointGenerator / selectedFilters : ", selectedFilters)

  const accessToken = obj.accesToken
  console.log("+ + + searchEndpointGenerator / accessToken : ", accessToken)

  let fetchPayloadOptions = endpointConfig.payload_options
  console.log("+ + + searchEndpointGenerator / fetchPayloadOptions : ", fetchPayloadOptions)


  // base query to be completed with args + questions
  let baseQuery = endpointConfig.root_url + '?'

  const appArgs = [
    'query', 
    'forMap', 
    'forStats', 
    'page', 
    'perPage', 
    'onlyGeocoded', 
    'itemId', 
    'shuffleSeed' 
  ]
  
  // loop in routeArgs + queries then append to baseQuery
  let argsArray = []
  for (let key in endpointConfigArgs ) {
    const EndpointArg = endpointConfigArgs[key]
    // console.log("+ + + searchEndpointGenerator / EndpointArg : ", EndpointArg)
    // if ( !EndpointArg.optional || appArgs.includes(EndpointArg.app_arg) ){
    if ( !EndpointArg.optional || appArgs.indexOf(EndpointArg.app_arg) !== -1 ){
        if ( questionParams[EndpointArg.app_arg] ) {
        let argString = EndpointArg.arg + '=' + questionParams[EndpointArg.app_arg]
        argsArray.push(argString)
      }
    }
  }

  // loop in selectedFilters to add filters request if any
  // find corresponding mapper in endPointConfig
  const filterMapper = endpointConfigArgs.find( c => c.app_arg === 'filters')
  // console.log("+ + + searchEndpointGenerator / filterMapper : \n ", filterMapper)
  if (filterMapper && selectedFilters.length > 0 ){
    const EndpointArg = filterMapper.arg
    for (let index in selectedFilters) {
      let argFilterString = EndpointArg + '=' + selectedFilters[index]
      argsArray.push(argFilterString)
    }
  }

  let argsLongString = argsArray.join('&')
  baseQuery += argsLongString

  // console.log("+ + + searchEndpointGenerator / baseQuery : \n ", baseQuery)

  // build header from endpointConfig
  let header = buildRequestHeader( accessToken, endpointConfigHeaderAuth ) 

  // build payload from endpointConfig
  let payload = fetchPayloadOptions && buildRequestPayload( fetchPayloadOptions )

  let endPointUrlAndPayload = {
    requestHeader : header,
    requestUrl : baseQuery,
    requestPayload : payload
  }
  console.log("+ + + searchEndpointGenerator / endPointUrlAndPayload : ", endPointUrlAndPayload)

  // return baseQuery
  return endPointUrlAndPayload
}

// FILTER RELATED
export function makeEmptySelectedFilters(filterDescriptions){
  // console.log("::: makeEmptySelectedFilters / filterDescriptions : ", filterDescriptions)
  const selectedFilters = new Map()
  for(const f of filterDescriptions){
    selectedFilters.set(f.name, new Set())
  }
  return selectedFilters;
}

export function createSelectedFiltersForSearch(selectedFiltersMap){
  let filtersUri = []
  selectedFiltersMap.forEach( (val,key,map) => {
    // console.log('val,key,map',val,key,map);
    val.forEach( (v) => {
      filtersUri.push(key + v)
    })
  })
  // console.log(filtersUri);
  return filtersUri
}

// OBJECT RELATED
// FUNCTION TO PARSE AN OBJECT GIVEN A PATH
export function getObjectDataFromPath(obj, path, splitter='/') {
  let current = obj; 
  // console.log("+ + + getObjectDataFromPath / current raw : \n", current )
  try {
    let current_temp = current
    path.split(splitter).forEach( function(p) { 
      current_temp = current_temp[p]; 
    }); 
    // console.log("+ + + getObjectDataFromPath / current final : \n", current )
    return current_temp
  } catch (e) {
    return ""
  }
}

export function filterObjectByKey(raw, allowedKeys ) {
  // console.log("+ + + filterObjectByKey / raw : \n", raw )
  // console.log("+ + + filterObjectByKey / allowedKeys : ", allowedKeys )
  const filtered = Object.keys(raw)
    .filter(key => allowedKeys.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: raw[key]
      };
    }, {});
  // console.log("+ + + filterObjectByKey / filtered : \n", filtered )
  // console.log()
  return filtered
}

export function getItemContent(fieldBlock, displayableItem, contentFields, noData, filterDescriptions, locale='fr'){
  
  const contentField = contentFields.find(f=> f.position == fieldBlock)

  // const log = true
  let blocktags = [
    'block_tags',
    'block_rb1_tags',
  ]
  let blocksToLog = [
    'block_tags',
    // 'block_abstract',
    // 'block_image',
  ]
  let typesToLog = [
    'object',
    // 'list',
    // 'list_tags'
  ]
  
  if ( contentField && contentField.is_visible ){

    const field = contentField.field
    const field_format = contentField.field_format

    const log = typesToLog.includes(field_format.type) && blocksToLog.includes(fieldBlock)
    // const log = blocksToLog.includes(fieldBlock)
    // const log = contentField && contentField.field_format.type === 'list_tags'
    
    log && console.log("\ngetItemContent / contentField : ", contentField)

    // log && console.log("\ngetItemContent / fieldBlock : ", fieldBlock)

    
    // log && console.log("getItemContent / field_format : ", field_format)
    
    let content = displayableItem[field]
    // log && console.log("getItemContent / content A : ", content)
    
    if ( content && content !== "None" && content !== "" ){

      const trimming = contentField.field_format.trim
      // log && console.log("getItemContent / trimming : ", trimming)
      
      try {
        
        // DEALING WITH LIST-LIKE RESULTS (TAGS)
        // slice tags in array
        if ( field_format.type === 'list_tags' ){

          // log && console.log("getItemContent / list_tags content ", content)

          if ( contentField.filter_correspondance ) {
            // log && console.log("getItemContent / list_tags content filterDescriptions : ", filterDescriptions)
            // choose filter corresponding to field

            let corrFilter = filterDescriptions.find( f => f.col_name === contentField.field )
            // log && console.log("getItemContent / list_tags content corrFilter : ", corrFilter)

            let filterChoices = corrFilter.choices
            // log && console.log("getItemContent / list_tags content filterChoices : ", filterChoices)
            
            content = content.map( c => {
              let tagDict = filterChoices.find( t => t.name === c )
              // log && console.log("getItemContent / list_tags content tagDict : ", tagDict)
              let tagText = tagDict && tagDict.choice_title.find( ct => ct.locale === locale ) 
              // log && console.log("getItemContent / list_tags content tagText : ", tagText)
              let corrContent = tagText.text
              // log && console.log("getItemContent / list_tags content corrContent : ", corrContent)
              return corrContent ? corrContent : c  
            })
          }

          content = content.map( tag => {
            let trim = ( trimming && tag.length > trimming ) ? trimming : tag.length 
            const tail = ( trimming && tag.length > trimming) ? '...' : ''
            // log && console.log("getItemContent / trim : ", trim)
            return tag.slice(0, trim) + tail
          })
          // log && console.log("getItemContent / content B : ", content)

          return content
        }

        // DEALING WITH LIST TO STRING RESULTS
        // get item from array if type == list 
        else if ( field_format.type === 'list'){
  
          log && console.log("getItemContent / list content : ", content)
  
          let begin = field_format.retrieve[0]
  
          // choose in array
          if ( begin === -1 ){
            content = content.join(' ')
          } 
          else if ( field_format.retrieve.length === 1 ) {
            content = content[ begin ]
          }
          else {
            let end = field_format.retrieve[1] ? field_format.retrieve[1] : content.length
            content = content.slice( begin, end )
            content = content.join(' ')
          }
  
          log && console.log("getItemContent / content C : ", content)
          
          // string is tag-like and needs to be splitten
          if ( contentField.is_tag_like ) {
            content = content.split(contentField.tags_separator).filter(c => c != "")

            if ( contentField.filter_correspondance ) {
              // log && console.log("getItemContent / list content filterDescriptions : ", filterDescriptions)
              // choose filter corresponding to field

              let corrFilter = filterDescriptions.find( f => f.col_name === contentField.field )
              // log && console.log("getItemContent / list content corrFilter : ", corrFilter)

              let filterChoices = corrFilter.choices
              // log && console.log("getItemContent / list content filterChoices : ", filterChoices)
              
              content = content.map( c => {
                let tagDict = filterChoices.find( t => t.name === c )
                // log && console.log("getItemContent / list content tagDict : ", tagDict)
                let tagText = tagDict && tagDict.choice_title.find( ct => ct.locale === locale ) 
                // log && console.log("getItemContent / list content tagText : ", tagText)
                let corrContent = tagText.text
                // log && console.log("getItemContent / list content corrContent : ", corrContent)
                return corrContent ? corrContent : c  
              })
            }

            content = content.map( tag => {
              let trim = ( trimming && tag.length > trimming ) ? trimming : tag.length 
              const tail = ( trimming && tag.length > trimming ) ? '...' : ''
              return tag.slice(0, trim) + tail
            })



            return content
          } 
  
          // trim string
          else {
            // log && console.log("getItemContent / string content : ", content)
            let trim = ( trimming && content.length > trimming ) ? trimming : content.length 
            // log && console.log("getItemContent / trim : ", trim)
            const tail = ( trimming && content.length > trimming) ? '...' : '';
            content = content.slice(0, trim) + tail
            return content
          }
  
        }
  
        // DEALING WITH NATIVE STRING RESULTS
        else if ( field_format.type === 'object' ) {
          log && console.log("getItemContent / object content : ", content)

          // string is tag-like and needs to be splitten
          if ( contentField.is_tag_like ) {
            content = content.split(contentField.tags_separator).filter(c => c != "")
            content = content.map( tag => {
              let trim = ( trimming && tag.length > trimming ) ? trimming : tag.length 
              const tail = ( trimming && tag.length > trimming ) ? '...' : ''
              return tag.slice(0, trim) + tail
            })

            // log && console.log("getItemContent / object content is_tag_like : ", content)

            if ( contentField.filter_correspondance ) {
              // log && console.log("getItemContent / object content filterDescriptions : ", filterDescriptions)
              // choose filter corresponding to field

              let corrFilter = filterDescriptions.find( f => f.col_name === contentField.field )
              // log && console.log("getItemContent / object content corrFilter : ", corrFilter)

              let filterChoices = corrFilter.choices
              // log && console.log("getItemContent / object content filterChoices : ", filterChoices)
              
              content = content.map( c => {
                let tagDict = filterChoices.find( t => t.name === c )
                // log && console.log("getItemContent / object content tagDict : ", tagDict)
                let tagText = tagDict && tagDict.choice_title.find( ct => ct.locale === locale ) 
                // log && console.log("getItemContent / object content tagText : ", tagText)
                let corrContent = tagText.text
                // log && console.log("getItemContent / object content corrContent : ", corrContent)
                return corrContent ? corrContent : c  
              })
            }

            content = content.map( tag => {
              let trim = ( trimming && tag.length > trimming ) ? trimming : tag.length 
              const tail = ( trimming && tag.length > trimming ) ? '...' : ''
              return tag.slice(0, trim) + tail
            })
            
            log && console.log("getItemContent / object content is_tag_like : ", content)

            return content
          } else {
            // log && console.log("getItemContent / object content : ", content)
            let trim = ( trimming && content.length > trimming ) ? trimming : content.length 
            const tail = ( trimming && content.length > trimming )? '...' : '' ;
            content = content.slice(0, trim) + tail        
            log && console.log("getItemContent / object content not tag like : ", content)
            return content
          }
        }

      } catch(e){
        content = noData
      }

    } 
    
    else {
      // content is none
      if ( fieldBlock === 'block_image'){
        return undefined
      }
      else if ( blocktags.includes(fieldBlock) ) {
        return [ noData ]
      }
      else {
        return noData
      }
    }

  } 
  else {
    // no contentField or is_visible === false
    return undefined
  }

}

export function getDefaultImage(defaultImages, item){

  let d = defaultImages
  let image
  let images_set  = (d) ? d.images_set : undefined

  if (images_set && images_set.length > 0) {
    const textureCount = images_set.length + 1
    let id = (item.id) ? parseInt(item.id.substr(item.id.length - 6), 16) % textureCount : 111111111111111111
    let tail = id % images_set.length + 1;
    let imageObj = images_set.find(function(i){
      return i.dft_text === 'img_'+tail;
    })
    image = imageObj.src_image
  } else {
    image = `/static/illustrations/textures/medium_fiche_${ (parseInt(id.substr(id.length - 6), 16)%textureCount) + 1}.png`
  }
  return image

}