from flask import Blueprint, request, jsonify
import requests
import os

chat_bp = Blueprint('chat', __name__)

# OpenRouter API configuration
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = "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"

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        messages = data.get('messages', [])
        model = data.get('model', '')
        
        if not messages:
            return jsonify({"error": "No messages provided"}), 400
        
        if not model:
            return jsonify({"error": "No model specified"}), 400
        
        # Prepare the request to OpenRouter
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://vision.diy.com",
            "X-Title": "vision.diy"
        }
        
        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 2000,
            "stream": False
        }
        
        # Make request to OpenRouter API
        response = requests.post(
            OPENROUTER_API_URL,
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code != 200:
            return jsonify({
                "error": f"OpenRouter API error: {response.status_code}",
                "details": response.text
            }), response.status_code
        
        result = response.json()
        
        # Extract the assistant's response
        if 'choices' in result and len(result['choices']) > 0:
            content = result['choices'][0]['message']['content']
            return jsonify({"content": content})
        else:
            return jsonify({"error": "No response from AI model"}), 500
            
    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timeout"}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@chat_bp.route('/models', methods=['GET'])
def get_models():
    """Get available models from OpenRouter"""
    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            "https://openrouter.ai/api/v1/models",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "Failed to fetch models"}), response.status_code
            
    except Exception as e:
        return jsonify({"error": f"Failed to fetch models: {str(e)}"}), 500

