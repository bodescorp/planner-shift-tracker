/**
 * Módulo de Export/Import
 * Exportar dados em PDF/CSV e importar
 */

export class DataExporter {
    constructor() {
        this.init();
    }

    init() {
        this.createExportButton();
    }

    createExportButton() {
        const menuList = document.querySelector('.menu-list');
        if (!menuList) return;

        const exportItem = document.createElement('li');
        exportItem.innerHTML = `
            <button class="menu-item" id="export-data-btn">
                <span class="menu-text">Exportar Dados</span>
            </button>
        `;
        
        menuList.appendChild(exportItem);

        document.getElementById('export-data-btn')?.addEventListener('click', () => {
            this.showExportModal();
        });
    }

    showExportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>Exportar Dados</h2>
                    <button class="modal-close" aria-label="Fechar">&times;</button>
                </div>
                <div class="modal-body" style="padding: 24px;">
                    <div class="export-options">
                        <button class="export-btn" data-format="json">
                            <span class="export-icon">📄</span>
                            <div>
                                <strong>JSON</strong>
                                <small>Backup completo dos dados</small>
                            </div>
                        </button>
                        
                        <button class="export-btn" data-format="csv">
                            <span class="export-icon">📊</span>
                            <div>
                                <strong>CSV</strong>
                                <small>Planilha de atividades</small>
                            </div>
                        </button>
                        
                        <button class="export-btn" data-format="text">
                            <span class="export-icon">📝</span>
                            <div>
                                <strong>Texto</strong>
                                <small>Relatório em texto simples</small>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                this.exportData(format);
                modal.remove();
            });
        });
    }

    exportData(format) {
        const data = this.gatherData();
        
        switch(format) {
            case 'json':
                this.exportJSON(data);
                break;
            case 'csv':
                this.exportCSV(data);
                break;
            case 'text':
                this.exportText(data);
                break;
        }
    }

    gatherData() {
        // Coletar todos os dados do localStorage
        const data = {
            exportDate: new Date().toISOString(),
            activities: {},
            checkboxes: {},
            settings: {
                currentWeek: localStorage.getItem('currentWeek'),
                lastWaterReminder: localStorage.getItem('lastWaterReminder')
            },
            notes: localStorage.getItem('planner-notes') || '',
            petData: {
                health: localStorage.getItem('pet-health'),
                happiness: localStorage.getItem('pet-happiness'),
                energy: localStorage.getItem('pet-energy')
            }
        };

        // Coletar estado dos checkboxes
        const checkboxesData = localStorage.getItem('checkboxes');
        if (checkboxesData) {
            try {
                data.checkboxes = JSON.parse(checkboxesData);
            } catch (e) {
                console.error('Erro ao parsear checkboxes:', e);
            }
        }

        // Coletar atividades do DOM (já que não estão no localStorage)
        const allActivities = document.querySelectorAll('.activity');
        allActivities.forEach(activity => {
            const checkbox = activity.querySelector('input[type="checkbox"]');
            if (!checkbox) return;
            
            const day = checkbox.dataset.day || 'unknown';
            const time = activity.querySelector('.time')?.textContent || '';
            const desc = activity.querySelector('.desc')?.textContent || '';
            const completed = checkbox.checked;
            
            if (!data.activities[day]) {
                data.activities[day] = [];
            }
            
            data.activities[day].push({
                time,
                desc,
                completed
            });
        });

        return data;
    }

    exportJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, `planner-backup-${this.getDateString()}.json`);
        window.toast.success('Dados exportados em JSON');
    }

    exportCSV(data) {
        let csv = 'Dia,Horário,Atividade,Concluída\n';

        Object.entries(data.activities).forEach(([day, activities]) => {
            const dayName = day.split('-')[0] || day;
            
            activities.forEach(activity => {
                const time = (activity.time || '').replace(/"/g, '""');
                const desc = (activity.desc || '').replace(/"/g, '""');
                const completed = activity.completed ? 'Sim' : 'Não';
                csv += `"${dayName}","${time}","${desc}",${completed}\n`;
            });
        });

        if (csv === 'Dia,Horário,Atividade,Concluída\n') {
            window.toast.warning('Nenhuma atividade para exportar');
            return;
        }

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, `planner-atividades-${this.getDateString()}.csv`);
        window.toast.success('Dados exportados em CSV');
    }

    exportText(data) {
        let text = `PLANNER - RELATÓRIO DE ATIVIDADES\n`;
        text += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n`;
        text += `${'='.repeat(60)}\n\n`;

        if (Object.keys(data.activities).length === 0) {
            text += 'Nenhuma atividade encontrada.\n';
        } else {
            Object.entries(data.activities).forEach(([day, activities]) => {
                const dayName = day.split('-')[0] || day;
                
                text += `${dayName.toUpperCase()}\n`;
                text += `${'-'.repeat(40)}\n`;

                if (activities.length === 0) {
                    text += `  Nenhuma atividade\n\n`;
                } else {
                    activities.forEach(activity => {
                        const status = activity.completed ? '[✓]' : '[ ]';
                        const time = activity.time || '';
                        const desc = activity.desc || '';
                        text += `  ${status} ${time} - ${desc}\n`;
                    });
                    text += `\n`;
                }
            });
        }

        // Adicionar notas se existirem
        if (data.notes) {
            text += `\n${'='.repeat(60)}\n`;
            text += `NOTAS\n`;
            text += `${'-'.repeat(40)}\n`;
            text += data.notes;
            text += `\n`;
        }

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
        this.downloadFile(blob, `planner-relatorio-${this.getDateString()}.txt`);
        window.toast.success('Relatório exportado');
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    getDateString() {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    }
}

// CSS para Export Modal
const exportStyles = `
.export-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.export-btn {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    color: inherit;
}

.export-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
}

.export-icon {
    font-size: 2rem;
    flex-shrink: 0;
}

.export-btn strong {
    display: block;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 4px;
}

.export-btn small {
    display: block;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = exportStyles;
document.head.appendChild(styleSheet);

export default DataExporter;
