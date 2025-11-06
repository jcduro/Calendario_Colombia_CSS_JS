
(function () {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthSelect = document.getElementById('monthSelect');
    const yearInput = document.getElementById('yearInput');
    const calMain = document.getElementById('calMain');

    // placeholder de festivos: { 'YYYY-MM-DD': 'Nombre' }
    let holidays = {};

    // estado actual
    let currentYear, currentMonth;

    function buildMonthOptions() {
        monthSelect.innerHTML = '';
        monthNames.forEach((m, i) => {
            const opt = document.createElement('option');
            opt.value = i; opt.textContent = m;
            monthSelect.appendChild(opt);
        });
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function iso(y, m, d) { return `${y}-${pad(m)}-${pad(d)}`; }


    function render(year, month) {
        // Cambiar el fondo según el mes
        const body = document.body;
        const monthNumber = month + 1; // de 1 a 12
        body.style.backgroundImage = `url('img/cover${monthNumber}.jpg')`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundAttachment = 'fixed';

        calMain.innerHTML = '';

        // Crear wrapper .month para mes principal
        const monthWrap = document.createElement('div');
        monthWrap.className = 'month';

        // título
        const title = document.createElement('h2');
        title.textContent = monthNames[month] + ' ' + year;
        monthWrap.appendChild(title);

        // tabla principal (reutiliza la lógica de creación de tabla)
        const table = document.createElement('table');
        table.className = 'calendar';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(h => {
            const th = document.createElement('th'); th.textContent = h; headerRow.appendChild(th);
        });
        thead.appendChild(headerRow); table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const firstDay = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let startIndex = firstDay.getDay(); // 0..6 (Sun..Sat)

        let row = document.createElement('tr');
        for (let i = 0; i < startIndex; i++) row.appendChild(document.createElement('td'));

        const today = new Date();
        for (let d = 1; d <= daysInMonth; d++) {
            const idx = (startIndex + d - 1) % 7;
            const cell = document.createElement('td');
            const daynum = document.createElement('div'); daynum.className = 'daynum'; daynum.textContent = d;
            cell.appendChild(daynum);

            const isoKey = iso(year, month + 1, d);
            if (holidays[isoKey]) {
                cell.classList.add('holiday');
                cell.setAttribute('data-holiday', holidays[isoKey]);
            }

            if (idx === 0 || idx === 6) cell.classList.add('weekend');
            if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d) {
                cell.classList.add('today');
            }

            row.appendChild(cell);
            if (idx === 6) { tbody.appendChild(row); row = document.createElement('tr'); }
        }
        if (row.children.length) {
            while (row.children.length < 7) row.appendChild(document.createElement('td'));
            tbody.appendChild(row);
        }

        // --- Asegurar 6 semanas (6 filas) siempre ---
        // Si tbody tiene menos de 6 filas, añadir filas vacías hasta 6.
        let currentRows = tbody.querySelectorAll('tr').length;
        while (currentRows < 6) {
            const emptyRow = document.createElement('tr');
            for (let c = 0; c < 7; c++) {
                const emptyCell = document.createElement('td');
                // opcional: añadir atributo aria-hidden para que lectores no lean celdas vacías
                emptyCell.setAttribute('aria-hidden', 'true');
                emptyRow.appendChild(emptyCell);
            }
            tbody.appendChild(emptyRow);
            currentRows++;
        }

        table.appendChild(tbody);
        monthWrap.appendChild(table);

        // -- PREVIEWS: mes anterior y siguiente --
        const prevMonth = (month === 0) ? 11 : month - 1;
        const prevYear = (month === 0) ? year - 1 : year;
        const nextMonth = (month === 11) ? 0 : month + 1;
        const nextYear = (month === 11) ? year + 1 : year;

        function createMiniMonth(y, m) {
            const wrap = document.createElement('div');
            wrap.className = 'month preview';
            const t = document.createElement('h2');
            t.textContent = monthNames[m] + ' ' + y;
            wrap.appendChild(t);

            const miniTable = document.createElement('table');
            miniTable.className = 'calendar';
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(h => {
                const th = document.createElement('th'); th.textContent = h; headerRow.appendChild(th);
            });
            thead.appendChild(headerRow); miniTable.appendChild(thead);

            const tbody = document.createElement('tbody');
            const firstDay = new Date(y, m, 1);
            const daysInMonth = new Date(y, m + 1, 0).getDate();
            let startIndex = firstDay.getDay();
            let row = document.createElement('tr');
            for (let i = 0; i < startIndex; i++) row.appendChild(document.createElement('td'));

            for (let d = 1; d <= daysInMonth; d++) {
                const idx = (startIndex + d - 1) % 7;
                const cell = document.createElement('td');
                const daynum = document.createElement('div'); daynum.className = 'daynum'; daynum.textContent = d;
                cell.appendChild(daynum);
                const isoKey = iso(y, m + 1, d);
                if (holidays[isoKey]) {
                    cell.classList.add('holiday');
                    cell.setAttribute('data-holiday', holidays[isoKey]);
                }
                if (idx === 0 || idx === 6) cell.classList.add('weekend');
                if (today.getFullYear() === y && today.getMonth() === m && today.getDate() === d) {
                    cell.classList.add('today');
                }
                row.appendChild(cell);
                if (idx === 6) { tbody.appendChild(row); row = document.createElement('tr'); }
            }
            if (row.children.length) {
                while (row.children.length < 7) row.appendChild(document.createElement('td'));
                tbody.appendChild(row);
            }

            // Asegurar 6 filas en preview también
            let rowsMini = tbody.querySelectorAll('tr').length;
            while (rowsMini < 6) {
                const emptyRow = document.createElement('tr');
                for (let c = 0; c < 7; c++) emptyRow.appendChild(document.createElement('td'));
                tbody.appendChild(emptyRow);
                rowsMini++;
            }

            miniTable.appendChild(tbody);
            wrap.appendChild(miniTable);

            // click para navegar a ese mes
            wrap.addEventListener('click', () => goto(y, m));
            return wrap;
        }

        // container para previews
        const previews = document.createElement('div');
        previews.className = 'month-previews';
        const miniPrev = createMiniMonth(prevYear, prevMonth);
        const miniNext = createMiniMonth(nextYear, nextMonth);
        previews.appendChild(miniPrev);
        previews.appendChild(miniNext);

        // añadir al DOM: mes principal + previews
        calMain.appendChild(monthWrap);
        calMain.appendChild(previews);

        // actualizar controles
        monthSelect.value = month;
        yearInput.value = year;
    }
    // ...existing code...

    // Nager.Date fetch + cache
    async function loadHolidaysFromNager(year) {
        const cacheKey = `holidays_CO_${year}`;
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) return JSON.parse(cached);

            const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/CO`);
            if (!res.ok) throw new Error('fetch failed');
            const list = await res.json(); // [{date:"2025-01-01", localName:"Año Nuevo", ...}, ...]
            const map = {};
            list.forEach(h => map[h.date] = h.localName || h.name);
            localStorage.setItem(cacheKey, JSON.stringify(map));
            return map;
        } catch (e) {
            console.warn('No se pudieron cargar festivos Nager.Date:', e);
            return {}; // fallback vacío
        }
    }

    // asegura festivos para un año y renderiza
    async function ensureHolidaysFor(year) {
        holidays = await loadHolidaysFromNager(year);
        render(currentYear, currentMonth);
    }

    // navigation helpers
    function goto(year, month) {
        currentYear = year;
        currentMonth = month;
        // cargar festivos del año correspondiente y luego renderizar
        ensureHolidaysFor(currentYear);
    }

    // event handlers
    document.getElementById('prevMonth').addEventListener('click', () => {
        let y = currentYear, m = currentMonth;
        m--; if (m < 0) { m = 11; y--; }
        goto(y, m);
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        let y = currentYear, m = currentMonth;
        m++; if (m > 11) { m = 0; y++; }
        goto(y, m);
    });
    document.getElementById('prevYear').addEventListener('click', () => {
        goto(currentYear - 1, currentMonth);
    });
    document.getElementById('nextYear').addEventListener('click', () => {
        goto(currentYear + 1, currentMonth);
    });

    monthSelect.addEventListener('change', () => {
        const m = parseInt(monthSelect.value, 10);
        goto(currentYear, m);
    });
    yearInput.addEventListener('change', () => {
        let y = parseInt(yearInput.value, 10);
        if (isNaN(y)) y = new Date().getFullYear();
        goto(y, currentMonth);
    });

    // init
    buildMonthOptions();
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();
    // load holidays and render initial view
    ensureHolidaysFor(currentYear);
})();
