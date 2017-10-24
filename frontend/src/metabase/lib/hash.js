export const hash = (dbId, query) => {
    let length = 0;
    if(!dbId || !query) {
        return ""
    }
    let filter = query.filter || []
    for(let i = 0; i < filter.length; i++) {
        if(Array.isArray(filter[i])) {
            length++
        }
    }
    
    return JSON.stringify({
        "dataset_query": {
            "type": "query",
            "database": dbId,
            "query": query,
            "length": length
        },
        "display": "table"
    })
}
