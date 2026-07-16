// Local author portraits are bundled as hashed Vite assets. Name-based fallback
// keeps legacy Wix authors visible when the production avatar field is empty.
import gururSonmez from '../../images/authors/gurur-sonmez.jpg';
import irisEryilmaz from '../../images/authors/iris-eryilmaz.jpg';
import muhammedMuglu from '../../images/authors/muhammed-muglu.jpg';
import suEvci from '../../images/authors/su-evci.jpg';
import alphanKarabat from '../../images/authors/alphan-karabat.jpg';
import humeyraFidan from '../../images/authors/humeyra-fidan.jpg';
import gokceSerim from '../../images/authors/gokce-serim.jpg';
import melikeZeynepKorkmaz from '../../images/authors/melike-zeynep-korkmaz.png';
import huseyinEmreSepetci from '../../images/authors/huseyin-emre-sepetci.jpg';

const normalize = (value = '') => value
    .toLocaleLowerCase('tr-TR')
    .replace(/i̇/g, 'i')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const AVATARS = {
    'gurur sonmez': gururSonmez,
    'iris eryilmaz': irisEryilmaz,
    'muhammed muglu': muhammedMuglu,
    'su evci': suEvci,
    'alphan karabat': alphanKarabat,
    'humeyra fidan': humeyraFidan,
    'gokce serim': gokceSerim,
    'melike zeynep korkmaz': melikeZeynepKorkmaz,
    'huseyin emre sepetci': huseyinEmreSepetci,
};

export const getAuthorAvatar = (name = '') => AVATARS[normalize(name)] || null;

export default AVATARS;
