/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { render } from '@testing-library/react';
import { useEffect } from 'react';
import { vi } from 'vitest';
import { useStore } from './store';

// Ensure Zustand is correctly set up for testing; remove this if not needed
// vi.mock('zustand'); 

function TestComponent({ selector, effect }) {
  const items = useStore(selector);

  useEffect(() => effect(items), [items]);

  return null;
}

test('should return default value at the start', () => {
  const selector = (store) => store.tasks;
  const effect = vi.fn();
  render(<TestComponent selector={selector} effect={effect} />);
  expect(effect).toHaveBeenCalledWith([]);
});

test('should add an item to the store and rerun the effect', () => {
  const selector = (store) => ({ tasks: store.tasks, addTask: store.addTask });
  const effect = vi.fn().mockImplementation((items) => {
    if (items.tasks.length === 0) {
      items.addTask('a', 'b');
    }
  });
  render(<TestComponent selector={selector} effect={effect} />);
  
  // Wait for effect to be called with updated state
  expect(effect).toHaveBeenCalledTimes(2);
  expect(effect).toHaveBeenCalledWith(
    expect.objectContaining({ tasks: [{ title: 'a', state: 'b' }] })
  );
});

test('should add an item to the store and then delete it', () => {
  const selector = (store) => ({
    tasks: store.tasks,
    addTask: store.addTask,
    deleteTask: store.deleteTask,
  });
  
  let createdTask = false;
  let currentItems;
  
  const effect = vi.fn().mockImplementation((items) => {
    currentItems = items;
    if (!createdTask) {
      items.addTask('a', 'b');
      createdTask = true;
    } else if (items.tasks.length === 1) {
      items.deleteTask('a');
    }
  });
  
  render(<TestComponent selector={selector} effect={effect} />);
  
  // Wait for effect to be called with updated state
  expect(effect).toHaveBeenCalledTimes(3);
  expect(currentItems.tasks).toEqual([]);
});
