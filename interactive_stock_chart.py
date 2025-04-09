import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import yfinance as yf
import matplotlib.image as mpimg
from datetime import datetime, timedelta
from io import BytesIO
import requests
from PIL import Image
import matplotlib.ticker as mticker
import ipywidgets as widgets
from IPython.display import display, clear_output

class InteractiveStockChart:
    def __init__(self):
        self.dark_mode = True
        self.setup_style()
        self.events = []
        self.current_data = None
        self.current_symbol = None
        self.create_widgets()
        
    def setup_style(self):
        """Set up the TradingView-like style for the chart"""
        if self.dark_mode:
            plt.style.use('dark_background')
            self.bg_color = '#1E1E1E'
            self.grid_color = '#2A2A2A'
            self.text_color = '#E0E0E0'
            self.line_color = '#2962FF'
        else:
            plt.style.use('default')
            self.bg_color = '#FFFFFF'
            self.grid_color = '#F0F0F0'
            self.text_color = '#333333'
            self.line_color = '#2962FF'
    
    def create_widgets(self):
        """Create interactive widgets for the chart"""
        # Asset selection widgets
        self.asset_type = widgets.Dropdown(
            options=['Stock', 'Crypto', 'ETF', 'Index'],
            value='Stock',
            description='Asset Type:',
            style={'description_width': 'initial'}
        )
        
        self.symbol_input = widgets.Text(
            value='AAPL',
            placeholder='Enter symbol (e.g., AAPL, BTC-USD)',
            description='Symbol:',
            style={'description_width': 'initial'}
        )
        
        self.period_select = widgets.Dropdown(
            options=[('1 Month', '1mo'), ('3 Months', '3mo'), ('6 Months', '6mo'), 
                     ('1 Year', '1y'), ('2 Years', '2y'), ('5 Years', '5y')],
            value='1y',
            description='Time Period:',
            style={'description_width': 'initial'}
        )
        
        self.interval_select = widgets.Dropdown(
            options=[('Daily', '1d'), ('Weekly', '1wk'), ('Monthly', '1mo'), ('Hourly', '1h')],
            value='1d',
            description='Interval:',
            style={'description_width': 'initial'}
        )
        
        self.load_button = widgets.Button(
            description='Load Data',
            button_style='primary',
            icon='download'
        )
        self.load_button.on_click(self.on_load_button_clicked)
        
        # Event addition widgets
        self.event_date = widgets.DatePicker(
            description='Event Date:',
            style={'description_width': 'initial'}
        )
        
        self.event_description = widgets.Text(
            placeholder='Event description',
            description='Description:',
            style={'description_width': 'initial'}
        )
        
        self.event_color = widgets.ColorPicker(
            concise=False,
            description='Color:',
            value='#FF9800',
            style={'description_width': 'initial'}
        )
        
        self.event_image_url = widgets.Text(
            placeholder='URL to image (optional)',
            description='Image URL:',
            style={'description_width': 'initial'}
        )
        
        self.add_event_button = widgets.Button(
            description='Add Event',
            button_style='success',
            icon='plus'
        )
        self.add_event_button.on_click(self.on_add_event_clicked)
        
        self.clear_events_button = widgets.Button(
            description='Clear Events',
            button_style='danger',
            icon='trash'
        )
        self.clear_events_button.on_click(self.on_clear_events_clicked)
        
        self.update_chart_button = widgets.Button(
            description='Update Chart',
            button_style='info',
            icon='refresh'
        )
        self.update_chart_button.on_click(self.on_update_chart_clicked)
        
        # Theme toggle
        self.theme_toggle = widgets.ToggleButton(
            value=True,
            description='Dark Mode',
            icon='moon'
        )
        self.theme_toggle.observe(self.on_theme_changed, names='value')
        
        # Output area for the chart
        self.output = widgets.Output()
        
        # Layout the widgets
        self.asset_selection = widgets.VBox([
            widgets.HBox([self.asset_type, self.symbol_input]),
            widgets.HBox([self.period_select, self.interval_select]),
            self.load_button
        ])
        
        self.event_addition = widgets.VBox([
            widgets.HBox([self.event_date, self.event_color]),
            self.event_description,
            self.event_image_url,
            widgets.HBox([self.add_event_button, self.clear_events_button, self.update_chart_button])
        ])
        
        self.ui = widgets.VBox([
            widgets.HBox([self.asset_selection, self.theme_toggle]),
            self.event_addition,
            self.output
        ])
    
    def on_load_button_clicked(self, b):
        """Handle the load button click event"""
        with self.output:
            clear_output(wait=True)
            try:
                self.current_symbol = self.symbol_input.value
                self.current_data = self.fetch_data(
                    self.current_symbol, 
                    self.period_select.value, 
                    self.interval_select.value
                )
                self.plot_chart(self.current_data, self.current_symbol, self.events)
            except Exception as e:
                print(f"Error loading data: {e}")
    
    def on_add_event_clicked(self, b):
        """Handle the add event button click event"""
        if not self.event_date.value or not self.event_description.value:
            with self.output:
                print("Please provide both date and description for the event")
                return
        
        event = {
            'date': self.event_date.value,
            'description': self.event_description.value,
            'color': self.event_color.value,
        }
        
        if self.event_image_url.value:
            event['image_url'] = self.event_image_url.value
        
        self.events.append(event)
        
        with self.output:
            print(f"Added event: {event['description']} on {event['date']}")
    
    def on_clear_events_clicked(self, b):
        """Handle the clear events button click event"""
        self.events = []
        with self.output:
            print("All events cleared")
    
    def on_update_chart_clicked(self, b):
        """Handle the update chart button click event"""
        if self.current_data is not None:
            with self.output:
                clear_output(wait=True)
                self.plot_chart(self.current_data, self.current_symbol, self.events)
    
    def on_theme_changed(self, change):
        """Handle the theme toggle change event"""
        self.dark_mode = change.new
        self.setup_style()
        if self.current_data is not None:
            with self.output:
                clear_output(wait=True)
                self.plot_chart(self.current_data, self.current_symbol, self.events)
    
    def fetch_data(self, symbol, period='1y', interval='1d'):
        """Fetch financial data from Yahoo Finance"""
        print(f"Fetching data for {symbol}...")
        data = yf.download(symbol, period=period, interval=interval)
        print(f"Retrieved {len(data)} data points")
        return data
    
    def load_image_from_url(self, url, max_size=(100, 100)):
        """Load and resize an image from a URL"""
        try:
            response = requests.get(url)
            img = Image.open(BytesIO(response.content))
            img = img.resize(max_size, Image.LANCZOS)
            return img
        except Exception as e:
            print(f"Error loading image: {e}")
            return None
    
    def plot_chart(self, data, symbol, events=None):
        """Plot the main chart with price data and events"""
        fig, ax = plt.subplots(figsize=(14, 8))
        fig.patch.set_facecolor(self.bg_color)
        ax.set_facecolor(self.bg_color)
        
        # Plot the price line
        ax.plot(data.index, data['Close'], color=self.line_color, linewidth=2)
        
        # Format the x-axis to show dates nicely
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
        ax.xaxis.set_major_locator(mdates.MonthLocator())
        plt.xticks(rotation=45)
        
        # Add grid
        ax.grid(True, linestyle='--', alpha=0.7, color=self.grid_color)
        
        # Set labels and title
        ax.set_xlabel('Date', color=self.text_color, fontsize=12)
        ax.set_ylabel('Price', color=self.text_color, fontsize=12)
        ax.set_title(f'{symbol} Price Chart', color=self.text_color, fontsize=16)
        
        # Format y-axis with currency
        ax.yaxis.set_major_formatter(mticker.FormatStrFormatter('$%.2f'))
        
        # Add volume as a bar chart at the bottom
        volume_ax = ax.twinx()
        volume_ax.set_ylim(0, data['Volume'].max() * 3)
        volume_ax.bar(data.index, data['Volume'], color='#5D6D7E', alpha=0.3, width=0.8)
        volume_ax.set_ylabel('Volume', color='#5D6D7E', fontsize=10)
        volume_ax.tick_params(axis='y', colors='#5D6D7E')
        
        # Add events if provided
        if events:
            for event in events:
                event_date = event['date']
                
                # Find the closest date in our data
                closest_date = min(data.index, key=lambda x: abs(x - pd.Timestamp(event_date)))
                price_at_event = data.loc[closest_date, 'Close']
                
                # Add annotation
                ax.annotate(
                    event['description'],
                    xy=(closest_date, price_at_event),
                    xytext=(20, 20),
                    textcoords="offset points",
                    arrowprops=dict(arrowstyle="->", color=self.text_color),
                    color=event.get('color', '#FF9800'),
                    fontsize=10,
                    bbox=dict(boxstyle="round,pad=0.3", fc='#00000066', ec=event.get('color', '#FF9800'), alpha=0.7)
                )
                
                # Add image if URL is provided
                if 'image_url' in event:
                    img = self.load_image_from_url(event['image_url'])
                    if img:
                        # Create an inset axes for the image
                        img_ax = fig.add_axes([
                            mdates.date2num(closest_date) / mdates.date2num(data.index[-1]),
                            price_at_event / ax.get_ylim()[1] - 0.1,
                            0.1, 0.1
                        ], anchor='NE')
                        img_ax.imshow(img)
                        img_ax.axis('off')
        
        # Style the ticks
        ax.tick_params(axis='both', colors=self.text_color)
        
        # Add a legend
        ax.legend(['Price'], loc='upper left', facecolor=self.bg_color, edgecolor=self.grid_color)
        
        plt.tight_layout()
        plt.show()
    
    def display(self):
        """Display the interactive chart UI"""
        display(self.ui)

# Example usage
if __name__ == "__main__":
    # Create and display the interactive chart
    chart = InteractiveStockChart()
    chart.display()
    
    # Print instructions
    print("Instructions:")
    print("1. Select asset type and enter symbol (e.g., AAPL for Apple, BTC-USD for Bitcoin)")
    print("2. Choose time period and interval")
    print("3. Click 'Load Data' to fetch and display the chart")
    print("4. Add events by selecting a date, entering description and optional image URL")
    print("5. Click 'Add Event' to add the event to the chart")
    print("6. Click 'Update Chart' to refresh the chart with the new events")
    print("7. Toggle between dark and light mode using the 'Dark Mode' button")
