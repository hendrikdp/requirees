define([], ()=>{
   return class extends HTMLElement{

       constructor(){
           super();
           this.render();
       }

       render(){
           const h1 = document.createElement('h1');
           h1.textContent = 'Hello world';
           this.appendChild(h1);
       }

   }
});

