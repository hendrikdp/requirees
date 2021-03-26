export default function(url){
    return fetch(url).then(r => r.text());
}