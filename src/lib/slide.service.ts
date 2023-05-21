import { tick } from "svelte";
import { get, writable } from "svelte/store";
import { SlideClass } from "./slide";

const defaultSlideHeight = 300; // TODO: usar la altura del primer Slide
export const windowHeight = writable(defaultSlideHeight);
export const slideStack = writable<SlideClass[]>([]);
export const slidesWrapperTranslatePixels = writable(0);

const slidesGap = 200;
const transitionDurationInMilliseconds = 400;
const sins = writable<string[]>([]);

export async function addSlideByKey(slideKey) {
	const stack = get(slideStack);
	const lastSlide = stack.at(-1);
	// Set the current last slide as invisible
	lastSlide.isVisible = false;
	// Get the new slide to add
	const newSlide = slidesData[slideKey];
	// Now the new slide will be the one visible
	newSlide.isVisible = true;
	// Add the new slide to the stack
	stack.push(newSlide);
	// Update the store
	slideStack.set(stack);

	// Let the new Slide render in order to get its height
	await tick();
	
	// Update the slide wrapper translate distance
	slidesWrapperTranslatePixels.set(get(slidesWrapperTranslatePixels) - (slidesGap + lastSlide.componentHeight));

	// Notify the window element in App.svelte about the new height
	windowHeight.set(newSlide.componentHeight);
}

export async function removeLastSlide() {
	const stack = get(slideStack);
	const lastSlide = stack.at(-1);
	const penultimateSlide = stack.at(-2);
	
	if (penultimateSlide.sinText) {
		// Remove sin text from the previous slide
		sins.set(get(sins).filter(sin => sin !== penultimateSlide.sinText));
	}

	// Update the visibility of last and penultimate slides
	lastSlide.isVisible = false;
	penultimateSlide.isVisible = true;
	slideStack.set(stack);

	// Update the slide wrapper translate distance
	slidesWrapperTranslatePixels.set(get(slidesWrapperTranslatePixels) + (slidesGap + penultimateSlide.componentHeight));

	// Notify the window element in App.svelte about the new height
	windowHeight.set(penultimateSlide.componentHeight);

	// Remove the last slide until the transition ends
	await new Promise(resolve => setTimeout(resolve, transitionDurationInMilliseconds));
	slideStack.set(stack.slice(0, -1));
}

export function addSinText(text: string) {
	sins.set([...get(sins), text]);
}

// Join texts by commas, using "y" before the last text if applicable
function joinTexts(texts: string[]) {
	let output = '';

    texts.forEach((text, index) => {
		if (index === 0) { // If first text
			output = texts[0];
		} else if (index === (texts.length - 1)) { // If last text
			output += ` y ${text}`;
		} else {
			output += `, ${text}`;
		}
    });

    return output;
}

const slidesData: {[key: string]: SlideClass} = {
	'first': new SlideClass({
		question: `
			<p>Test para saber si irás al Cielo o al infierno.</p>
			<p>¿Te atreves a saberlo?</p>`,
		buttons: [
			{
				text: 'Sí',
				slideToGo: 'testRules',
			}
		]
	}),
	'testRules': new SlideClass({
		question: `
			<p>Para obtener los mejores resultados en este test, por favor <b>conteste con la mayor sinceridad posible</b>, seleccionando entre las opciones que más se acerquen a su creencia.</p>
			<br>
			<p>Este test no recopila ninguna información personal.</p>`,
		buttons: [
			{
				text: 'OK',
				slideToGo: 'beliefSelection',
			}
		]
	}),
	'beliefSelection': new SlideClass({
		question: `
			<p>¿Cuál es tu creencia?</p>`,
		buttons: [
			{
				text: 'Soy católico',
				slideToGo: 'start',
			},
			{
				text: 'Soy cristiano evangélico',
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
	}),
	'start': new SlideClass({
		question: `
			<p>Este test utiliza los 10 mandamientos de la Biblia para saber si eres suficientemente bueno para ir al Cielo.</p>`,
		buttons: [
			{
				text: 'Empecemos!',
				slideToGo: 'doesGodExist',
			},
		]
	}),
	'doesGodExist': new SlideClass({
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
	}),
	'isThereLifeAfterDeath': new SlideClass({
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
	}),
	'areYouAfraidOfDying': new SlideClass({
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
	}),
	'wouldYouGoToHeaven': new SlideClass({
		question: `
			<p>Si el Cielo <b>existiera</b>, ¿Crees que irías allá?</p>`,
		buttons: [
			{
				text: 'Seguro! Soy una buena persona',
				slideToGo: 'doesHellExist',
			},
			{
				text: 'No lo creo, mi vida no anda bien',
				slideToGo: 'doesHellExist',
			},
		]
	}),
	'whereYouGoAfterDeath': new SlideClass({
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
	}),
	'doesHellExist': new SlideClass({
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
	}),
	'howManyLies': new SlideClass({
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
	}),
	'whatWillHappenToHitler': new SlideClass({
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
	}),
	'someoneWhoSaysManyLies': new SlideClass({
		question: `
			<p>¿Cómo le llaman a alguien que dice muchas mentiras?</p>`,
		sinText: 'un mentiroso',
		buttons: [
			{
				text: 'Un mentiroso',
				acceptsSin: true,
				slideToGo: 'haveYouEverStolen',
			},
		]
	}),
	'haveYouEverStolen': new SlideClass({
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
	}),
	'someoneWhoSteals': new SlideClass({
		question: `
			<p>¿Cómo le llaman a alguien que roba?</p>`,
		sinText: 'un ladrón',
		buttons: [
			{
				text: 'Un ladrón',
				acceptsSin: true,
				slideToGo: 'haveYouUsedTheNameOfGodInVain',
			},
		]
	}),
	'haveYouUsedTheNameOfGodInVain': new SlideClass({
		question: `
			<p>Cuando se dicen frases como “Oh, my God!”, “¡Dios mío!”, “¡Jesús bendito!”, o se mencionan los nombres de “Dios”, “Jesús” o “Espíritu Santo” <b>sin conciencia</b> y <b>sin reverencia</b>, se está tomando el nombre de Dios en vano.</p>
			<br>
			<p>¿Has usado el nombre de Dios en vano?</p>`,
		sinText:'un blasfemo',
		buttons: [
			{
				text: 'Sí',
				acceptsSin: true,
				slideToGo: 'haveYouCommittedAdulteryWithYourDesire',
			},
			{
				text: 'No',
				slideToGo: 'haveYouCommittedAdulteryWithYourDesire',
			},
		]
	}),
	'haveYouCommittedAdulteryWithYourDesire': new SlideClass({
		question: `
			<div>Jesús dijo:</div>
			<div><i>“… Cualquiera que mira a una mujer y desea acostarse con ella, comete adulterio en su corazón.”</i></div>
			<div><b>Mateo 5:28 (NBV)</b></div>
			<br>
			<p>¿Alguna vez has visto alguna mujer (o a un hombre) de esta manera?</p>`,
		sinText: 'un adúltero de corazón',
		buttons: [
			{
				text: 'Sí',
				acceptsSin: true,
				slideToGo: 'doYouConsiderYourselfInnocentOrGuilty',
			},
			{
				text: 'No',
				slideToGo: 'doYouConsiderYourselfInnocentOrGuilty',
			},
		]
	}),
	'doYouConsiderYourselfInnocentOrGuilty': new SlideClass({
		question: '<dynamic text>', // The text from this slide gets updated each time the sins array changes. The base text is in the `updateSinsSlide()` function.
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
	}),
	'doYouConsiderYourselfInnocentOrGuilty2': new SlideClass({
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
	}),
	'areYouWorryingToEndInHell': new SlideClass({
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
	}),
	'areYouThinkingAboutYourLife': new SlideClass({
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
	}),



	'PENDIENTE': new SlideClass({
		question: `
			<p>Flujo de conversación pendiente...</p>`,
		buttons: [
		]
	}),
};

function updateSinsSlide() {
	const sinsSlideKey = 'doYouConsiderYourselfInnocentOrGuilty';
	const baseSlideQuestion = `
		<p>Entonces admites que eres %sins%. En el día del juicio final se juzgarán estas cosas.</p>
		<br>
		<p>Cómo te consideras, ¿inocente o culpable?</p>`
	const updatedSlideQuestion = baseSlideQuestion.replace('%sins%', joinTexts(get(sins)));
	slidesData[sinsSlideKey].question = updatedSlideQuestion;
}

sins.subscribe(() => updateSinsSlide());

// Set the first slide
const firstSlide = slidesData.first;
firstSlide.isVisible = true;
slideStack.set([firstSlide]);
