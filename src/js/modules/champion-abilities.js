/**
 * Módulo para buscar e gerenciar habilidades de campeões do League of Legends
 * Integração com Data Dragon API
 */

const API_BASE = 'https://ddragon.leagueoflegends.com/cdn';
const LANG = 'pt_BR';
let currentVersion = '15.22.1';
let championData = null;

/**
 * Obter versão mais recente do Data Dragon
 */
async function getLatestVersion() {
    try {
        const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await res.json();
        return versions[0];
    } catch (error) {
        console.warn('Erro ao buscar versão mais recente, usando padrão:', currentVersion);
        return currentVersion;
    }
}

/**
 * Obter detalhes completos de um campeão
 */
async function getChampionDetails(version, champId) {
    const url = `${API_BASE}/${version}/data/${LANG}/champion/${champId}.json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data[champId];
}

/**
 * Carregar dados das habilidades do campeão
 */
export async function loadChampionAbilities(championName = 'Ornn') {
    try {
        currentVersion = await getLatestVersion();
        championData = await getChampionDetails(currentVersion, championName);
        return championData;
    } catch (error) {
        console.error('Erro ao carregar dados do campeão:', error);
        return null;
    }
}

/**
 * Obter URL do ícone da passiva
 */
export function getPassiveIconUrl() {
    if (!championData || !championData.passive) return null;
    return `${API_BASE}/${currentVersion}/img/passive/${championData.passive.image.full}`;
}

/**
 * Obter URL do ícone de uma habilidade (Q, W, E, R)
 * @param {string} spellKey - 'Q', 'W', 'E' ou 'R'
 */
export function getSpellIconUrl(spellKey) {
    if (!championData || !championData.spells) return null;
    
    const spellIndex = { 'Q': 0, 'W': 1, 'E': 2, 'R': 3 }[spellKey.toUpperCase()];
    if (spellIndex === undefined) return null;
    
    const spell = championData.spells[spellIndex];
    if (!spell) return null;
    
    return `${API_BASE}/${currentVersion}/img/spell/${spell.image.full}`;
}

/**
 * Obter nome de uma habilidade
 */
export function getSpellName(spellKey) {
    if (!championData || !championData.spells) return null;
    
    const spellIndex = { 'Q': 0, 'W': 1, 'E': 2, 'R': 3 }[spellKey.toUpperCase()];
    if (spellIndex === undefined) return null;
    
    const spell = championData.spells[spellIndex];
    return spell?.name || null;
}

/**
 * Obter nome da passiva
 */
export function getPassiveName() {
    if (!championData || !championData.passive) return null;
    return championData.passive.name;
}

/**
 * Obter descrição de uma habilidade
 */
export function getSpellDescription(spellKey) {
    if (!championData || !championData.spells) return null;
    
    const spellIndex = { 'Q': 0, 'W': 1, 'E': 2, 'R': 3 }[spellKey.toUpperCase()];
    if (spellIndex === undefined) return null;
    
    const spell = championData.spells[spellIndex];
    return spell?.description || null;
}

/**
 * Obter descrição da passiva
 */
export function getPassiveDescription() {
    if (!championData || !championData.passive) return null;
    return championData.passive.description;
}

/**
 * Obter todos os dados das habilidades formatados para uso no pet system
 */
export function getAbilitiesForPetActions() {
    if (!championData) return null;
    
    return {
        passive: {
            key: 'P',
            name: getPassiveName(),
            icon: getPassiveIconUrl(),
            description: getPassiveDescription()
        },
        q: {
            key: 'Q',
            name: getSpellName('Q'),
            icon: getSpellIconUrl('Q'),
            description: getSpellDescription('Q')
        },
        w: {
            key: 'W',
            name: getSpellName('W'),
            icon: getSpellIconUrl('W'),
            description: getSpellDescription('W')
        },
        e: {
            key: 'E',
            name: getSpellName('E'),
            icon: getSpellIconUrl('E'),
            description: getSpellDescription('E')
        },
        r: {
            key: 'R',
            name: getSpellName('R'),
            icon: getSpellIconUrl('R'),
            description: getSpellDescription('R')
        }
    };
}

/**
 * Obter dados completos do campeão
 */
export function getChampionData() {
    return championData;
}
