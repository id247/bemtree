block('menu')(
    tag()('ul'),

    /**
     * Вынесем в шаблон всю разметку,
     * которая необходима для представления.
     *
     * Семантика блока простая: меню и ссылки в нем
     *
     * {
     *     block: 'menu',
     *     active: 'index',
     *     content: [
     *         { url: '#', content: 'Привет' },
     *         { url: '#', content: 'БЭМ' }
     *     ]
     * }
     */
    content()(function() {
        var content = this.ctx.content;
        var active = this.ctx.active;
        console.log(this.ctx);
        return content.map(function(item) {

            return {
                elem: 'item',
                content: {
                    block: 'link',
                    url: item.url.indexOf(active) === -1 ? item.url : false,
                    attrs: item.attrs,
                    mix: {
                        block: 'menu',
                        elem: 'link'
                    },
                    content: item.content
                }
            };
        });
    })
);

block('menu').elem('item')(
    tag()('li')
);
