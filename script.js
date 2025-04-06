    // Массив с данными
    const links = [
        { href: 'https://t.me/diverlin', icon: 'simple-icons:telegram' },
        { href: 'https://github.com/D1verlin', icon: 'simple-icons:github' },
        { href: 'https://x.com/d1verlin', icon: 'simple-icons:twitter' },
        { href: 'https://discordapp.com/users/294066838579707904', icon: 'simple-icons:discord' },
        { href: 'https://steamcommunity.com/id/D1verlin/', icon: 'simple-icons:steam' },
        { href: 'https://shikimori.one/Diverlin', icon: 'simple-icons:shikimori' },
        { href: 'https://mangalib.me/ru/user/118385', icon: 'arcticons:mangalib'},
    ];

    function generateLinks(links) {
        const container = document.querySelector("#links");
        container.innerHTML = '';
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'link';
            a.innerHTML = `<span class="iconify" data-icon="${link.icon}"></span>`;
            container.appendChild(a);
        });
    }

    generateLinks(links);

    const projects = [
        { name: 'WSA', href: 'https://wsa.diverlin.ru', description: 'Installation assistance and configuring windows'},
        { name: 'Bookmarks Hub', href: 'https://bh.diverlin.ru/', description: 'Bookmark manager'},
    ];

    function genereateProjects(projects) {
        const container = document.querySelector(".projects");
        container.innerHTML = '';
        projects.forEach(project => {
            const a = document.createElement("a");
            a.href = project.href;
            a.target = "_blank";
            a.className = "project";
            let p_header = document.createElement("div");
            p_header.className = "p_header"
            let h2 = document.createElement("h2");
            h2.innerHTML = project.name;
            let span = document.createElement("span");
            span.className = 'iconify';
            span.setAttribute("data-icon","quill:link-out");
            let description = document.createElement("p");
            description.innerHTML = project.description;
            p_header.prepend(h2);p_header.append(span);
            a.prepend(p_header);a.append(description);
            container.appendChild(a);
        });
    }

genereateProjects(projects);