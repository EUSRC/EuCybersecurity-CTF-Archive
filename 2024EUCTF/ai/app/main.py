import gradio as gr
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

theme_kargs = {
    "font": ["Helvetica", "ui-sans-serif", "system-ui", "sans-serif"],
    "font_mono": ["IBM Plex Mono", "ui-monospace", "Consolas", "monospace"],
}

custom_css = """
.svelte-1pjfiar {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    cursor: auto !important;
}
"""

model = AutoModelForCausalLM.from_pretrained(
    "./TinyStories-33M").eval()
tokenizer = AutoTokenizer.from_pretrained("./TinyStories-33M")

HINT = """这是一个“原始”AI。

你能否让我说出`you are smart`。

如果你成功了，你将会得到我的秘密(flag)。

现在开始吧！"""


def check_message(message):
    if len(message) > 200:
        return False, "[*] 出错了，消息长度不能超过 200。"
    return True, None


def check_response(message, response):
    response = response.strip().lower()
    info = ""
    euctf = os.getenv('GZCTF_FLAG')
    if "you are smart" in response:
        info += f"\n👏👏👏 flag: `{euctf}` 👏👏👏"
    return info


def predict(message):
    model_inputs = tokenizer.encode(message, return_tensors="pt")
    model_outputs = model.generate(
        model_inputs,
        max_new_tokens=30,
        num_beams=1,
        pad_token_id=tokenizer.eos_token_id,
    )
    model_outputs = model_outputs[0, len(model_inputs[0]):]
    model_output_text = tokenizer.decode(
        model_outputs, skip_special_tokens=True)
    return model_output_text


def bot(message, _history):
    ok, info = check_message(message)
    if not ok:
        return info

    try:
        model_output_text = predict(message)
    except Exception:
        return "出错了，请重新尝试。"

    info = check_response(message, model_output_text)
    if info:
        model_output_text += info

    return model_output_text


with gr.Blocks(theme=gr.themes.Default(**theme_kargs), css=custom_css) as demo:
    # Token for hackergame
    demo.load(None, [], [])

    #
    # Chatbot
    #
    chat = gr.ChatInterface(bot)
    # source_code = gr.Code(
    #     #value=open(__file__).read(), language="python", label="main.py"
    #     value=open(__file__, 'r', encoding='utf-8').read(), language="python", label="main.py"
    # )
    demo.load(
        lambda: ([(None, HINT)], [(None, HINT)]), [], [
            chat.chatbot_state, chat.chatbot]
    )

if __name__ == "__main__":
    demo.queue().launch(server_name="0.0.0.0" ,server_port=9001, show_api=False, share=True)
