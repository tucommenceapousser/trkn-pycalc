from flask import Flask, render_template, jsonify, request
import plotly.graph_objects as go
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/plot', methods=['POST'])
def plot():
    data = request.get_json()
    expression = data.get('expression', 'x')
    x_range = data.get('range', [-10, 10])
    
    x = np.linspace(x_range[0], x_range[1], 1000)
    try:
        expression = expression.replace('sin', 'np.sin')
        expression = expression.replace('cos', 'np.cos')
        expression = expression.replace('tan', 'np.tan')
        expression = expression.replace('log', 'np.log10')
        expression = expression.replace('ln', 'np.log')
        expression = expression.replace('sqrt', 'np.sqrt')
        expression = expression.replace('pi', 'np.pi')
        expression = expression.replace('e', 'np.e')
        expression = expression.replace('^', '**')
        
        y = eval(expression, {"__builtins__": None}, {"x": x, "np": np})
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=x.tolist(), y=y.tolist(), mode='lines', name=expression))
        fig.update_layout(
            template='plotly_dark',
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            xaxis=dict(gridcolor='rgba(128,128,128,0.2)', zerolinecolor='rgba(128,128,128,0.5)'),
            yaxis=dict(gridcolor='rgba(128,128,128,0.2)', zerolinecolor='rgba(128,128,128,0.5)'),
            margin=dict(l=50, r=50, t=30, b=30),
            height=400
        )
        return jsonify({'plot': fig.to_json()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
