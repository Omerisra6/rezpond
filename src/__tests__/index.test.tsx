import { describe, expect, it, vitest } from 'vitest';
import { rezpond } from '../index';

describe('Rezpond', () => {
	describe('render', () => {
		it('should render the component', () => {
			const appContainer = document.createElement('div');

			const Root = () => {
				return (
					<div>
						<h1>Hello, World!</h1>
					</div>
				);
			};

			const app = rezpond.createApp(appContainer);

			app.render(Root);

			expect(appContainer.innerHTML).toBe(
				'<div><h1>Hello, World!</h1></div>',
			);
		});
	});

	describe('useState', () => {
		it('should get the initial state', () => {
			const appContainer = document.createElement('div');

			const { render, useState } = rezpond.createApp(appContainer);

			const Root = () => {
				const [state] = useState('Hello, World!');
				return (
					<div>
						<h1>{state}</h1>
					</div>
				) as HTMLElement;
			};

			render(Root);

			expect(appContainer.innerHTML).toBe(
				'<div><h1>Hello, World!</h1></div>',
			);
		});

		it('should update the state', () => {
			const appContainer = document.createElement('div');

			const { render, useState } = rezpond.createApp(appContainer);

			const Root = () => {
				const [state, setState] = useState(0);
				return (
					<div>
						<h1 class={'counter'}>{state}</h1>
						<button
							onClick={() => {
								setState((state) => state + 1);
							}}
						>
							Increase
						</button>
					</div>
				) as HTMLElement;
			};

			render(Root);

			const button = appContainer.querySelector('button');

			button.click();

			const counter = appContainer.querySelector('.counter');

			expect(counter.innerHTML).toBe('1');
		});
	});

	describe('useEffect', () => {
		it('should run the effect on init', () => {
			const appContainer = document.createElement('div');

			const { render, useEffect } = rezpond.createApp(appContainer);

			const effect = vitest.fn();

			const Root = () => {
				useEffect(() => {
					effect();
				}, []);

				return (
					<div>
						<h1>Initial</h1>
					</div>
				) as HTMLElement;
			};

			render(Root);

			expect(effect).toHaveBeenCalledTimes(1);
		});

		it('should run the when it dependencies change', () => {
			const appContainer = document.createElement('div');

			const { render, useEffect, useState } =
				rezpond.createApp(appContainer);

			const effect = vitest.fn();

			const Root = () => {
				const [state, setState] = useState(0);

				useEffect(() => {
					effect();
				}, []);

				return (
					<div>
						<h1>{state}</h1>
						<button
							onClick={() => {
								setState((state) => state + 1);
							}}
						>
							Increase
						</button>
					</div>
				) as HTMLElement;
			};

			render(Root);

			expect(effect).toHaveBeenCalledTimes(1);

			const button = appContainer.querySelector('button');

			button.click();

			expect(effect).toHaveBeenCalledTimes(1);
		});
	});
});
