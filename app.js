// app.js - Handles UI state, logic, and networking

document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        name: '',
        group: '',
        selectedPart1: new Set(),
        selectedPart2: new Set()
    };

    const WebAppUrl = "https://script.google.com/macros/s/AKfycbx1tj_xukQ7GaNw7haeApNNz-Yg-jd_ekP6LvGdPP_1l6rIbQ0tOqmwWQ1gX144Nu0/exec";

    // DOM Elements
    const views = {
        login: document.getElementById('view-login'),
        selection1: document.getElementById('view-selection-1'),
        selection2: document.getElementById('view-selection-2'),
        loading: document.getElementById('view-loading'),
        report: document.getElementById('view-report')
    };

    // Navigation function
    const showView = (viewName) => {
        Object.values(views).forEach(v => {
            v.classList.remove('active-view');
            setTimeout(() => v.classList.add('hidden'), 200); // Wait for fade out
        });

        setTimeout(() => {
            views[viewName].classList.remove('hidden');
            // triggering reflow
            void views[viewName].offsetWidth;
            views[viewName].classList.add('active-view');
        }, 200);
        window.scrollTo(0, 0);
    };

    // Helpers
    const updateButtonState = (btnId, count) => {
        const btn = document.getElementById(btnId);
        btn.disabled = count < 5;
    };

    // Card rendering logic
    const renderCards = (containerId, items, selectionSet, counterId, nextBtnId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'word-card';
            if (selectionSet.has(item.id)) card.classList.add('selected');

            card.innerHTML = `
                <div class="word-title">${item.word}</div>
                <div class="word-desc">${item.desc || ''}</div>
            `;

            card.addEventListener('click', () => {
                if (selectionSet.has(item.id)) {
                    selectionSet.delete(item.id);
                    card.classList.remove('selected');
                } else {
                    selectionSet.add(item.id);
                    card.classList.add('selected');
                }

                document.getElementById(counterId).innerText = selectionSet.size;
                updateButtonState(nextBtnId, selectionSet.size);
            });
            container.appendChild(card);
        });

        document.getElementById(counterId).innerText = selectionSet.size;
        updateButtonState(nextBtnId, selectionSet.size);
    };

    // Login Form Submit
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('login-name').value.trim();
        const groupInput = document.getElementById('group-select').value;
        const errorEl = document.getElementById('login-error');

        // Regex for exactly 3 Korean characters
        if (!/^[가-힣]{3}$/.test(nameInput) || !groupInput) {
            errorEl.classList.remove('hidden');
            return;
        }

        errorEl.classList.add('hidden');
        state.name = nameInput;
        state.group = groupInput;

        showView('selection1');
        renderCards('grid-1', data.part1, state.selectedPart1, 'count-1', 'btn-next-1');
    });

    // Navigation Buttons
    document.getElementById('btn-next-1').addEventListener('click', () => {
        showView('selection2');
        renderCards('grid-2', data.part2, state.selectedPart2, 'count-2', 'btn-submit');
    });

    document.getElementById('btn-prev-1').addEventListener('click', () => {
        showView('login');
    });

    document.getElementById('btn-prev-2').addEventListener('click', () => {
        showView('selection1');
    });

    // Submit and Analyze
    document.getElementById('btn-submit').addEventListener('click', async () => {
        showView('loading');

        // 1. Gather mapped Data
        const getSelectedItems = (dataSet, ids) => dataSet.filter(d => ids.has(d.id));
        const p1Items = getSelectedItems(data.part1, state.selectedPart1);
        const p2Items = getSelectedItems(data.part2, state.selectedPart2);

        // Prep payload for Google Sheets
        const payload = {
            timestamp: new Date().toISOString(),
            group: state.group,
            name: state.name,
            part1_words: p1Items.map(i => i.word).join(', '),
            part2_words: p2Items.map(i => i.word).join(', ')
        };

        try {
            // Using no-cors/text payload to prevent complex CORS preflight issues common with GAS
            await fetch(WebAppUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error("Transmission error/CORS warning:", e);
            // We proceed to report generation even if transmission fails in dev env
        }

        // Generate Report
        generateReport(p1Items, p2Items);

        // Fake delay for realistic feeling
        setTimeout(() => {
            showView('report');
        }, 1500);
    });

    // Report Generation Logic
    const generateReport = (p1, p2) => {
        document.getElementById('report-author').innerText = `${state.group} ${state.name}`;

        // Render Tags
        const renderTags = (items, elementId) => {
            const el = document.getElementById(elementId);
            el.innerHTML = items.map(i => `<span class="tag">${i.word}</span>`).join('');
        };
        renderTags(p1, 'tags-part1');
        renderTags(p2, 'tags-part2');

        // Extract Categories
        const getTopCategory = (items) => {
            const counts = {};
            items.forEach(i => counts[i.category] = (counts[i.category] || 0) + 1);
            return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        };

        const getTraitsString = (items) => {
            const uniqCategories = [...new Set(items.map(i => i.category))];
            return uniqCategories.map(c => data.analysis.categories[c]).join(', ');
        };

        // Inject Analysis Text
        document.getElementById('analysis-part1').innerHTML = data.analysis.part1Tpl(getTraitsString(p1));
        document.getElementById('analysis-part2').innerHTML = data.analysis.part2Tpl(getTraitsString(p2));

        const dominantCategory = getTopCategory([...p1, ...p2]);
        document.getElementById('analysis-integrated').innerHTML = data.analysis.integratedTpl(data.analysis.categories[dominantCategory]);

        // Inject Suggestions
        const sugs = data.analysis.suggestions[dominantCategory];
        const sugHTML = sugs.map(s => `
            <div class="suggestion-card">
                <h4>${s.title}</h4>
                <p><strong>이유:</strong> ${s.reason}</p>
                <h5>실행 방안:</h5>
                <ul class="action-items">
                    ${s.actionInfo.map(act => `<li>${act}</li>`).join('')}
                </ul>
            </div>
        `).join('');
        document.getElementById('suggestions-container').innerHTML = sugHTML;
    };

    // PDF Download
    document.getElementById('btn-download-pdf').addEventListener('click', () => {
        const element = document.getElementById('report-content');
        const opt = {
            margin: 10,
            filename: `협업브릿지_결과_${state.group}_${state.name}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Add a temporary class to fix button visibility issues if any
        element.classList.add('pdf-exporting');
        html2pdf().set(opt).from(element).save().then(() => {
            element.classList.remove('pdf-exporting');
        });
    });

    // Restart
    document.getElementById('btn-restart').addEventListener('click', () => {
        state.selectedPart1.clear();
        state.selectedPart2.clear();
        document.getElementById('login-form').reset();
        showView('login');
    });
});
