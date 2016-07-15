const vars = {
	meta: {
        title: 'О компании',
    },
    menu: {
        active: 'about'
    },
}

block('root').replace()(function() {
    this.data = this.ctx.data;
    return {
        block: 'page',
        title: vars.meta.title,
        styles: [
            'index.min.css'
        ],
        scripts: [
            'index.min.js'
        ],
    };
});


block('page').content()(function() {
    return {
        block: 'menu',
        active: vars.menu.active,
        content: this.data.links
    };
});
