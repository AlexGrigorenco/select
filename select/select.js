


const getTemplate = (data = [], placeholder, selectedId) => {

    let text = placeholder ?? 'Nothing'

    const items = data.map(item => {

        let cls = ''

        if(item.id === selectedId){
            text = item.value
            cls = 'selected'
        }

        return `
                <li data-type="item" data-id="${item.id}" class="select__item ${cls}">${item.value}</li>
        `
    })

    return `
            <div class="select__close" data-type="close"></div>
            <div class="select__input" data-type="input">
                <span data-type="value">${text}</span>
                <i class="fa-solid fa-sort-down"></i>
            </div>
            <div class="select__dropdown">
                <ul class="select__list">
                    ${items.join('')}
                </ul>
            </div>
`
}


export class Select {
    constructor(selector, options){
        this.$el = document.querySelector(selector)
        this.options = options
        this.selectedId = options.selectedId

        this.#render()
        this.#setup()
    }
    

    #render(){
        const {data, placeholder} = this.options
        this.$el.classList.add('select')
        this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
    }

    #setup(){
        this.clickHandler = this.clickHandler.bind(this)
        this.$el.addEventListener('click', this.clickHandler)
        this.$value = this.$el.querySelector('[data-type="value"]')

    }



    clickHandler(e){

        const {type} = e.target.dataset

        if(type === 'input'){

            this.toggle()
        }else if(type === 'item'){
            const id = e.target.dataset.id
            this.select(id)
        }else if(type === 'close'){
            this.close()
        }
        
    }

    get current(){
        return this.options.data.find(item => item.id === this.selectedId)
    }


    open(){
        this.$el.classList.add('open')
    }

    close(){
        this.$el.classList.remove('open')
    }
    toggle(){
        this.$el.classList.toggle('open')
    }
    select(id){
        this.selectedId = id
        this.$value.textContent = this.current.value
        this.close()
        this.$el.querySelectorAll('[data-type="item"]').forEach(item => item.classList.remove('selected'))
        this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')
        this.options.onSelect ? this.options.onSelect(this.current) : null
    }



    destroy(){
        this.$el.removeEventListener('click', this.clickHandler)
        this.$el.innerHTML = ''
    }
}