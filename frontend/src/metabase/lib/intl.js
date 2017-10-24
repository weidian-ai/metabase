import intl from 'wd-react-intl-universal'
export const getHTML = (key,options = {}) => {
    const defaultValue = options['defaultValue'] || key
    return intl.getHTML(key).d(defaultValue)
}
export const get = (key,options = {}) => {
    const defaultValue = options['defaultValue'] || key
    return intl.get(key).d(defaultValue)
}