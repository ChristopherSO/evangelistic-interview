// TODO: Give better names to these interfaces, they should not be prefixed with an "I" since it should not matter if they are interfaces or clases.

export interface IButton {
	text: string,
	action?: Function,
	slideToGo: string,
}

export interface ISlide {
	question: string,
	buttons: IButton[],
}
