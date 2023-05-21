import { get, writable } from "svelte/store";
import type { ISlide } from "./interfaces";

export const slideStack = writable<ISlide[]>([]);
export const slidesWrapperTranslate = writable(0);

const defaultSlideHeight = 300;
const slidesGap = 200;
const transitionDurationInMilliseconds = 400;
const sins: string[] = [];
let sinsText = ''

export function addSlideByKey(slideKey) {
	const stack = get(slideStack);
	// Set the current last slide as invisible
	stack.at(-1).isVisible = false;
	// Get the new slide to add
	const newSlide = slidesData[slideKey];
	// Now the new slide will be the one visible
	newSlide.isVisible = true;
	// Add the new slide to the stack
	stack.push(newSlide);
	// Update the store
	slideStack.set(stack);
	
	// Update the slide wrapper translate distance
	slidesWrapperTranslate.set(get(slidesWrapperTranslate) - (defaultSlideHeight + slidesGap));
}

export async function removeLastSlide() {
	// First update the visibility of last and penultimate slides, then remove the last slide.
	const stack = get(slideStack);
	stack.at(-2).isVisible = true;
	stack.at(-1).isVisible = false;
	slideStack.set(stack);

	// Update the slide wrapper translate distance
	slidesWrapperTranslate.set(get(slidesWrapperTranslate) + (defaultSlideHeight + slidesGap));

	// Remove the last slide until the transition ends
	await new Promise(resolve => setTimeout(resolve, transitionDurationInMilliseconds));
	slideStack.set(stack.slice(0, -1));
}

// Join texts by commas, using "y" before the last text if applicable
function joinTexts(texts: string[]) {
    let output = '';

    texts.forEach((text, index) => {
		if (index === texts.length - 2 && texts.length > 2) {
		  output += text + " y ";
		} else if (index === texts.length - 1) {
		  output += text;
		} else {
		  output += text + ", ";
		}
    });

    return output;
}

function updateSinsSlide() {
	let slideText = slidesData['doYouConsiderYourselfInnocentOrGuilty'].question;
	slideText = slideText.replace('%sins%', joinTexts(sins));
	slidesData['doYouConsiderYourselfInnocentOrGuilty'].question = slideText;
}

const slidesData: {[key: string]: ISlide} = {
	'first': {
		question: `
			<p>Test para saber si irás al Cielo o al infierno.</p>
			<p>¿Te atreves a saberlo?</p>`,
		buttons: [
			{
				text: 'Sí',
				slideToGo: 'beliefSelection',
			}
		]
	},
	'beliefSelection': {
		question: `
			<p>Para que este test se ajuste más a usted, por favor seleccione la opción que más se ajusta a tu creencia:</p>`,
		buttons: [
			{
				text: 'Soy católico',
				slideToGo: 'start',
			},
			{
				text: 'Soy cristiano',
				slideToGo: 'PENDIENTE',
			},
			{
				text: 'No practico ninguna religión',
				slideToGo: 'start',
			},
			{
				text: 'Soy ateo',
				slideToGo: 'PENDIENTE',
			},
			{
				text: 'Otro',
				slideToGo: 'PENDIENTE',
			},
		]
	},
	'start': {
		question: `
			<p>Este test utiliza los 10 mandamientos de la Biblia para saber si eres suficientemente bueno para ir al Cielo.</p>`,
		buttons: [
			{
				text: 'Empecemos!',
				slideToGo: 'doesGodExist',
			},
		]
	},
	'doesGodExist': {
		question: `
			<p>Primero, unas preguntas elementales.</p>
			<br>
			<p>¿Crees que Dios existe?</p>`,
		buttons: [
			{
				text: 'Sí',
				slideToGo: 'isThereLifeAfterDeath',
			},
			{
				text: 'No',
				slideToGo: 'isThereLifeAfterDeath',
			},
		]
	},
	'isThereLifeAfterDeath': {
		question: `
			<p>¿Crees que existe vida después de la muerte?</p>`,
		buttons: [
			{
				text: 'Sí',
				slideToGo: 'areYouAfraidOfDying',
			},
			{
				text: 'No estoy seguro',
				slideToGo: 'areYouAfraidOfDying',
			},
			{
				text: 'No',
				slideToGo: 'wouldYouGoToHeaven',
			},
		]
	},
	'areYouAfraidOfDying': {
		question: `
			<p>¿Tienes miedo de morir?</p>`,
		buttons: [
			{
				text: 'Sí',
				slideToGo: 'whereYouGoAfterDeath',
			},
			{
				text: 'No',
				slideToGo: 'whereYouGoAfterDeath',
			},
		]
	},
	'wouldYouGoToHeaven': {
		question: `
			<p>Si el Cielo <b>existiera</b>, ¿Crees que irías allá?</p>`,
		buttons: [
			{
				text: 'Seguro! Soy una buena persona',
				slideToGo: 'doesHellExist',
			},
			{
				text: 'No lo creo, mi vida no anda bien',
				slideToGo: 'PENDIENTE',
			},
		]
	},
	'whereYouGoAfterDeath': {
		question: `
			<p>A dónde crees que irás cuando mueras?</p>`,
		buttons: [
			{
				text: 'Al Cielo',
				slideToGo: 'howManyLies',
			},
			{
				text: 'Al infierno',
				slideToGo: 'PENDIENTE',
			},
		]
	},
	'doesHellExist': {
		question: `
			<p>¿Crees que existe el infierno?</p>`,
		buttons: [
			{
				text: 'Sí',
				slideToGo: 'howManyLies',
			},
			{
				text: 'No',
				slideToGo: 'whatWillHappenToHitler',
			},
		]
	},
	'howManyLies': {
		question: `
			<p>¿Cuántas mentiras has dicho en tu vida?</p>`,
		buttons: [
			{
				text: 'Pocas',
				slideToGo: 'haveYouEverStolen',
			},
			{
				text: 'Muchas!',
				slideToGo: 'someoneWhoSaysManyLies',
			},
		]
	},
	'whatWillHappenToHitler': {
		question: `
			<p>¿Qué crees que le pasará a Hitler en el día del juicio?</p>`,
		buttons: [
			{
				text: 'Se irá al infierno',
				slideToGo: 'howManyLies',
			},
			{
				text: '(???)',
				slideToGo: 'PENDIENTE',
			},
		]
	},
	'someoneWhoSaysManyLies': {
		question: `
			<p>¿Cómo le llaman a alguien que dice muchas mentiras?</p>`,
		buttons: [
			{
				text: 'Un mentiroso',
				action: () => {
					sins.push('un mentiroso'); // TODO: *** Cambiar `action: Function` por `sinText: string` para que, si se toca el botón, se agrega el sin al arreglo y si se le da el botón atrás, se remueve de la lista. Asociar esta propiedad al Slide y no al botón para que sea fácil de usar por la acción de slide anterior. ***
				},
				slideToGo: 'haveYouEverStolen',
			},
		]
	},
	'haveYouEverStolen': {
		question: `
			<p>¿Alguna vez has robado?</p>`,
		buttons: [
			{
				text: 'Sí',
				slideToGo: 'someoneWhoSteals',
			},
			{
				text: 'No',
				slideToGo: 'haveYouUsedTheNameOfGodInVain',
			},
		]
	},
	'someoneWhoSteals': {
		question: `
			<p>¿Cómo le llaman a alguien que roba?</p>`,
		buttons: [
			{
				text: 'Un ladrón',
				action: () => sins.push('un ladrón'),
				slideToGo: 'haveYouUsedTheNameOfGodInVain',
			},
		]
	},
	'haveYouUsedTheNameOfGodInVain': {
		question: `
			<p>Cuando se dicen frases como “Oh, my God!”, “¡Dios mío!”, “¡Jesús bendito!”, o se mencionan los nombres de “Dios”, “Jesús” o “Espíritu Santo” <b>sin conciencia</b> y <b>sin reverencia</b>, se está tomando el nombre de Dios en vano.</p>
			<br>
			<p>¿Has usado el nombre de Dios en vano?</p>`,
		buttons: [
			{
				text: 'Sí',
				action: () => sins.push('un blasfemo'),
				slideToGo: 'haveYouCommittedAdulteryWithYourDesire',
			},
			{
				text: 'No',
				slideToGo: 'haveYouCommittedAdulteryWithYourDesire',
			},
		]
	},
	'haveYouCommittedAdulteryWithYourDesire': {
		question: `
			<div>Jesús dijo:</div>
			<div><i>“… Cualquiera que mira a una mujer y desea acostarse con ella, comete adulterio en su corazón.”</i></div>
			<div><b>Mateo 5:28 (NBV)</b></div>
			<br>
			<p>¿Alguna vez has visto alguna mujer (o a un hombre) de esta manera?</p>`,
		buttons: [
			{
				text: 'Sí',
				action: () => {
					sins.push('un adúltero de corazón');
					updateSinsSlide();
				},
				slideToGo: 'doYouConsiderYourselfInnocentOrGuilty',
			},
			{
				text: 'No',
				action: () => updateSinsSlide(),
				slideToGo: 'doYouConsiderYourselfInnocentOrGuilty',
			},
		]
	},
	'doYouConsiderYourselfInnocentOrGuilty': {
		question: `
			<p>Entonces admites que eres %sins%.</p>
			<br>
			<p> En el día del juicio final se juzgarán estas cosas.</p>
			<br>
			<p>Cómo te consideras, ¿inocente o culpable?</p>`,
		buttons: [
			{
				text: 'Inocente',
				slideToGo: 'doYouConsiderYourselfInnocentOrGuilty2',
			},
			{
				text: 'Culpable',
				slideToGo: 'areYouWorryingToEndInHell',
			},
		]
	},
	'doYouConsiderYourselfInnocentOrGuilty2': {
		question: `
			<div><b>Apocalipsis 21:8</b> dice:</div>
			<p><i> “Pero los cobardes, los incrédulos, los corruptos, los asesinos, los que cometen inmoralidades sexuales, los que practican la brujería, los que adoran ídolos y los mentirosos, serán arrojados al lago que arde con fuego y azufre, que es la segunda muerte».”</i></p>
			<br>
			<p>Cómo te consideras, ¿inocente o culpable?</p>`,
		buttons: [
			{
				text: 'Inocente',
				slideToGo: 'PENDIENTE',
			},
			{
				text: 'Culpable',
				slideToGo: 'areYouWorryingToEndInHell',
			},
		]
	},
	'areYouWorryingToEndInHell': {
		question: `
			<p>¿Te preocupa que si mueres hoy y Dios te hace justicia vas a terminar en el infierno?</p>`,
		buttons: [
			{
				text: 'Sí',
				slideToGo: 'areYouThinkingAboutYourLife',
			},
			{
				text: 'No',
				slideToGo: 'doYouConsiderYourselfInnocentOrGuilty2',
			},
		]
	},
	'areYouThinkingAboutYourLife': {
		question: `
			<p>¿Entonces estás comenzando a pensar sobre tu vida y lo valiosa que es?</p>`,
		buttons: [
			{
				text: 'Sí',
				slideToGo: 'PENDIENTE',
			},
			{
				text: 'No',
				slideToGo: 'PENDIENTE',
			},
		]
	},



	'PENDIENTE': {
		question: `
			<p>Flujo de conversación pendiente...</p>`,
		buttons: [
		]
	},
};

// Set the first slide
const firstSlide = slidesData.first;
firstSlide.isVisible = true;
slideStack.set([firstSlide]);
