# Why Tech Companies Are Switching from DOM to Canvas for Large Data Tables

## Introduction

Many technology companies like Google, Microsoft, and meta-frameworks like React and Vue have been transitioning away from traditional DOM-based rendering for large data tables (e.g., spreadsheets, data grids) to Canvas-based rendering. This document explains the key differences between these approaches and why Canvas is often preferred for large datasets.

## DOM vs Canvas Rendering for Large Tables

In the provided examples:
1. `dom_table_example.html` - Renders 1,000,000 records using traditional HTML elements (DOM)
2. `canvas_table_example.html` - Renders the same 1,000,000 records using HTML5 Canvas

## Key Differences

### 1. Performance

**DOM-based tables:**
- Create an actual DOM node for every cell (5,000,000+ elements for our 1,000,000-row table)
- Each DOM node consumes memory and requires the browser to maintain its state
- Browser must perform layout, painting, and compositing for all visible elements
- Performance significantly degrades as the dataset grows larger
- Loading and initial rendering will likely crash or freeze most browsers
- Even with a confirmation dialog, most browsers cannot handle 5 million DOM nodes

**Canvas-based tables:**
- Create a single Canvas element regardless of table size
- Only render what is currently visible in the viewport (typically 15-20 rows)
- No DOM nodes created for individual cells
- Much faster initial rendering and scrolling performance
- Handles datasets of 1,000,000+ rows with reasonable performance
- Uses batch processing to avoid UI freezing during data generation

### 2. Memory Usage

**DOM-based tables:**
- Extreme memory usage (proportional to the number of rows)
- Each cell has an associated DOM node with event listeners and styles
- Browser's memory management for DOM nodes can be expensive
- Will likely exceed browser memory limits and crash with 1M records

**Canvas-based tables:**
- Relatively low memory usage (mostly just storing the raw data)
- Only stores the raw data and rendering logic
- No persistent DOM nodes beyond the Canvas element itself
- Memory usage scales linearly with data size but not rendering complexity

### 3. Scroll Behavior

**DOM-based tables:**
- Relies on browser's native scrolling
- Will be extremely jerky or completely unusable with 1M records
- Will cause severe layout thrashing during rapid scrolling
- Browser may become completely unresponsive

**Canvas-based tables:**
- Custom scroll implementation with both wheel events and scrollbar
- Smooth scrolling even with very large datasets
- Implements virtual rendering with precise control
- Only renders the 15-20 rows currently visible
- Can scroll through all 1M records with consistent performance

### 4. Implementation Complexity

**DOM-based tables:**
- Simpler to implement initially but requires virtualization for large datasets
- Easier to style with CSS
- Better accessibility support by default
- Works well with browser's built-in features for small datasets

**Canvas-based tables:**
- More complex implementation with custom scrolling and rendering
- Requires manual rendering of all visual elements
- Custom handling of user interactions (no automatic event delegation)
- Requires custom implementation of accessibility features
- Benefits from optimization techniques like batch processing and text truncation

## When to Choose Canvas Over DOM

Companies typically switch to Canvas-based rendering when:

1. **Scale requirements far exceed DOM capabilities**
   - Datasets with hundreds of thousands or millions of rows
   - Real-time data that requires frequent updates
   - Need to maintain responsive UI with massive datasets

2. **Smooth scrolling is essential**
   - Financial applications where users rapidly scroll through large datasets
   - Trading platforms, monitoring dashboards, analytics tools
   - Applications that cannot tolerate jerky scrolling

3. **Custom visualizations are needed**
   - Complex rendering requirements beyond simple tabular data
   - Integration with charts, heatmaps, or other visual elements
   - Need for custom cell renderers or visual indicators

4. **Memory constraints exist**
   - Applications running on low-power devices
   - Web applications that need to handle very large datasets without crashing
   - Mobile web applications with limited memory

## Real-world Examples of Canvas-based Data Grids

Many popular data grid libraries have moved to Canvas-based rendering:

- Microsoft Excel Online
- Google Sheets
- ag-Grid Enterprise
- Handsontable Pro
- React-Window and React-Virtualized
- SlickGrid
- Facebook's DataTable components

## The Million-Row Test Case

Our examples with 1,000,000 records demonstrate the fundamental limitations of DOM-based approaches:

1. **DOM Example**:
   - Includes a warning and confirmation dialog because it will likely crash the browser
   - Modified to use a button to trigger rendering instead of loading automatically
   - Still not practical for real-world use with this scale of data

2. **Canvas Example**:
   - Implements batch processing to generate data without freezing the UI
   - Includes a progress bar to show data generation status
   - Uses a custom scrollbar for better control and feedback
   - Implements text truncation for better rendering performance
   - Demonstrates smooth scrolling through all million records

## Conclusion

While DOM-based tables are simpler to implement and offer better accessibility by default, Canvas-based rendering is the only practical approach for handling very large datasets due to superior performance and memory efficiency. The examples provided demonstrate the dramatic difference in viability between these approaches when dealing with 1,000,000 records.

For smaller datasets (up to a few hundred rows), traditional DOM-based tables may still be the better choice due to simplicity and built-in features. However, for applications requiring high-performance data visualization with large datasets, Canvas-based rendering is not just preferred but often the only viable solution. 