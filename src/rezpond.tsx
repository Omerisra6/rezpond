type Props = { [key: string]: any };

const createElement = (
	tag: string | ((props: Props, children: any[] | string) => HTMLElement),
	props: Props | null,
	...children: Array<Node|string>
): HTMLElement => {
	if (typeof tag === "function") return tag(props || {}, children);

	const element = document.createElement(tag);

	Object.entries(props || {}).forEach(([name, value]) => {
		if (name.startsWith("on") && name.toLowerCase() in window) {
			element.addEventListener(name.toLowerCase().slice(2), value as EventListenerOrEventListenerObject );
		} else {
			if ( typeof value === "string" ) {
				element.setAttribute(name, value.toString());
			}
		}
	});

	if (!Array.isArray(children)) {
		appendChild(element, children);
		return element
	}

	children.forEach((child) => {
		appendChild(element, child);
	});

	return element;
};

const appendChild = (parent: HTMLElement, child: Node | Node[] | string ): void => {
	if (Array.isArray(child)) {
		child.forEach((nestedChild) => { appendChild(parent, nestedChild)}) ;
	} else {
		if (typeof child === "object" ) {
			parent.appendChild(child);
			return;
		}
		parent.appendChild(document.createTextNode(child.toString()));
	}
};

type SetterFn<T> = (prevState: T) => T;
type SetState<T> = (newValue: T | SetterFn<T>) => void;

const createApp = (appContainer: HTMLElement ) => {
	let Root: (() => HTMLElement) | null = null;
	const hooks: any[] = [];
	let index: number = 0;

	const useState = <T,>(initial: T): [T, SetState<T>] => {
		// Ensure hooks[index] is initialized with the initial value on first use
		if (hooks[index] === undefined) {
			hooks[index] = initial;
		}

		const state: T = hooks[index];
		const __index: number = index;

		const setState: SetState<T> = (newValue) => {
			if (typeof newValue === "function") {
				// TypeScript doesn't know if newValue is a function here, so cast it
				hooks[__index] = (newValue as SetterFn<T>)(state);
			} else {
				hooks[__index] = newValue;
			}

			render();
		};

		index++;
		return [state, setState];
	};

	const useEffect = (callback: () => void, deps: any[]): void => {
		const prevDeps = hooks[index];

		if (!prevDeps) {
			hooks[index] = deps;
			index++;
			callback();
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const areEqual = deps.every((val, i) => val === prevDeps[i]);
		if (!areEqual) {
			callback();
		}

		hooks[index] = deps;
		index++;
	};

	const render = (Component?: () => HTMLElement): void => {
		appContainer.innerHTML = "";
		index = 0;
		Root = Component || Root;
		if (Root) {
			appContainer.appendChild( <Root/> );
		}
	};

	return { useState, render, useEffect };
};

export const rezpond = {
	createApp,
	createElement,
}
