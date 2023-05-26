import { addSinText } from './slide.service';

interface IButton {
	text: string,
	acceptsSin?: boolean,
	slideToGo: string,
}

export class SlideClass {
	question: string;
	sinText?: string;
	buttons: IButton[];
	componentHeight: number;

	constructor(props: {question: string, buttons: IButton[], sinText?: string}) {
		this.question = props.question;
		this.buttons = props.buttons;
		this.sinText = props.sinText;
	}

	handleClick() {
		if (this.sinText) {
			addSinText(this.sinText);
		}
	}
}