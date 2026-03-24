from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from datetime import datetime
import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)
app.secret_key = 'ctf_secret_key_change_this_in_production'

# Configuration
FLAG = "flag{testflag}"
MODEL_PATH = "TinyStories-33M" # Assumes model is in subfolder or same level
# In a real environment, you'd check file existence. 
# For this code to run without the model present (during dev), we can wrap it.

print(f"Current Working Directory: {os.getcwd()}")
print("Loading Model... this might take a moment.")
global model_load_error
model_load_error = "Unknown error"

try:
    if os.path.exists(MODEL_PATH):
        print(f"Found model folder at: {os.path.abspath(MODEL_PATH)}")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        model = AutoModelForCausalLM.from_pretrained(MODEL_PATH)
        model_loaded = True
        model_load_error = None
        print("Model loaded successfully.")
    else:
        msg = f"Warning: Model not found at {os.path.abspath(MODEL_PATH)}. CWD is {os.getcwd()}"
        print(msg)
        model_load_error = msg
        model_loaded = False
except Exception as e:
    msg = f"Error loading model: {str(e)}"
    print(msg)
    model_load_error = msg
    model_loaded = False

def get_flag():
    try:
        # Priority 1: Environment Variable (like in reference)
        env_flag = os.getenv('GZCTF_FLAG')
        if env_flag:
            return env_flag
            
        # Priority 2: File System
        if os.path.exists('/flag'):
            with open('/flag', 'r') as f:
                return f.read().strip()
                
        # Fallback
        return "flag{local_test_flag}"
    except Exception as e:
        return f"flag{error_reading_flag}"

def get_ai_response(message):
    message = message.strip()
    
    # 1. Length Check (from reference)
    if len(message) > 200:
        return "[*] 出错了，消息长度不能超过 200。"

    # --- AI Generation ---
    response = ""
    
    if model_loaded:
        try:
            # Tokenize
            model_inputs = tokenizer.encode(message, return_tensors="pt")
            
            # Generate (Parameters from reference)
            with torch.no_grad():
                model_outputs = model.generate(
                    model_inputs, 
                    max_new_tokens=30, 
                    num_beams=1, 
                    pad_token_id=tokenizer.eos_token_id
                )
            
            # Decode (Slicing logic from reference)
            model_outputs = model_outputs[0, len(model_inputs[0]):]
            response = tokenizer.decode(model_outputs, skip_special_tokens=True)
                
        except Exception as e:
            response = f"[System Error: Model inference failed - {str(e)}]"
            
    else:
        return f"[System: AI Model not available. Error: {model_load_error}]"

    if not response:
        response = "..."

    # --- Flag Trigger (from reference) ---
    triggers = ["best friends", "good friends"]
    for t in triggers:
        if t in response.lower():
            response += f"\n\n👏👏👏 flag: `{get_flag()}` 👏👏👏"
            break

    return response

@app.route('/', methods=['GET', 'POST'])
def index():
    if 'conversation' not in session:
        session['conversation'] = []

    # Handle Clear
    if request.args.get('clear'):
        session['conversation'] = []
        return redirect(url_for('index'))

    if request.method == 'POST':
        user_message = request.form.get('message', '').strip()
        if user_message:
            # Get AI Response
            ai_response = get_ai_response(user_message)
            
            # Add to history
            # Note: We must re-assign session['conversation'] due to how Flask sessions work with mutable objects
            history = session['conversation']
            history.append({
                'user': user_message,
                'ai': ai_response,
                'time': datetime.now().strftime('%H:%M:%S')
            })
            if len(history) > 50:
                history.pop(0)
            session['conversation'] = history
            
            # Ajax handling
            # In original script.js it might use fetch/ajax
            # If the request wants JSON (common in these apps), we should support it.
            # The original code PHP checked `isset($_POST['ajax'])` or similar headers.
            # Let's check if it asks for JSON or if it's a standard form post.
            # The PHP code: if (isset($_POST['ajax'])) ...
            
            if 'ajax' in request.form or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                 return jsonify({'response': ai_response})

        return redirect(url_for('index'))

    return render_template('index.html', conversation=session.get('conversation', []), current_time=datetime.now().strftime('%H:%M:%S'))

if __name__ == '__main__':
    # Disable debug mode to avoid 403 issues in some restricted environments
    app.run(host='0.0.0.0', port=5001)
