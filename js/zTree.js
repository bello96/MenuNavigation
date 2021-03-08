(() => {
    let ztreeContainer = document.querySelector('.ztree-container'),
        ztreeUL = ztreeContainer.querySelector('ul');

    // 数据绑定生成DOM结构
    const binding = data => {
        const html = data => {
            let str = ``;
            data.forEach(item => {
                let { title, open, children } = item;
                let ischildren = children && children.length > 0 ? true : false
                str += `<li>
                    <span ischildren=${ischildren} class="ztree-title">${title}</span>
                    ${ischildren ? `
                        <em class="ztree-icon ${open ? 'open' : ''}"></em>
                        <ul class="ztree-level" style="display:${open ? 'block' : 'none'}">
                            ${html(children)}
                        </ul>
                    `: ``}
                </li>`;
            });
            return str;
        };
        ztreeUL.innerHTML = html(data);
    };

    // 切换展开关闭功能
    const switchopen = target => {
        let ulBox = target.nextElementSibling, // 获取当前元素下一级的dom节点(ul)
            isopen = target.classList.contains('open'); // 切换打开关闭标记
        if (!ulBox) return;
        if (isopen) {
            // 让其隐藏
            target.classList.remove('open');
            ulBox.style.display = 'none';
            return;
        }
        // 让其展开 
        target.classList.add('open');
        ulBox.style.display = 'block';
    }

    // 点击委托处理点击事件
    const eventDelega = () => {
        ztreeContainer.addEventListener('click', function (ev) {
            let target = ev.target;
            if (target.tagName === "EM") {
                switchopen(target) // 切换展开关闭功能
            } else if (target.tagName === "SPAN") {
                let ischildren = target.getAttribute('ischildren')
                if (ischildren === 'true') {
                    let nextEle = target.nextElementSibling; // 获取当前元素下一级的dom节点(em)
                    switchopen(nextEle) // 切换展开关闭功能
                } else if (ischildren === 'false') {
                    // 只有当没有子集时 获取点击标题
                    alert(target.innerHTML)
                }

            }
        });
    };

    // 数据请求
    fetch('/data.json').then(res => res.json()).then(data => {
        binding(data); // 获取数据 创建dom结构
        eventDelega(); // 事件委托注册点击事件
    });
})();