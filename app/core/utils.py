import asyncio
import csv
import io
import os
import base64
import boto3
import datetime
import hashlib
import openpyxl
import pandas as pd
import re
import requests
import sys
import traceback
import urllib.parse
from openai import OpenAI
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from PIL import Image
import pprint

openai = OpenAI(api_key=settings.OPEN_API_KEY)

def myprint(res):
  print("\n-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^\n")
  print(res)
  print("\n=========================================================\n")
  
  
def check_30_days(payment_date, num_days=30):
  days = timezone.now()
  return days, days > timedelta(days=num_days)

def calculate_prompt_cost(response):
  # Extract token usage
  usage = response.usage
  prompt_tokens = usage.prompt_tokens
  completion_tokens = usage.completion_tokens
  total_tokens = usage.total_tokens
  
  cost_per_token_prompt = 0.03 / 1000  # Replace with your model's prompt token cost
  cost_per_token_completion = 0.06 / 1000
  
  # Calculate the cost
  prompt_cost = prompt_tokens * cost_per_token_prompt
  completion_cost = completion_tokens * cost_per_token_completion
  total_cost = prompt_cost + completion_cost
  
  result = {
    "Prompt tokens": prompt_tokens,
    "Completion tokens": completion_tokens,
    "Total tokens": total_tokens,
    "Estimated Cost": total_cost
  }
  
  return result

def sanitize_string(input_string):
    # Remove non-printable ASCII characters
    sanitized_string = ''.join(char for char in input_string if not (0 <= ord(char) <= 31))
    return sanitized_string
  
# def sanitize_string(input_string):
#     # Remove non-printable ASCII characters
#     sanitized_string = ''
#     for char in input_string:
#       if 32 <= ord(char) <= 126 or ord(char) == 10 or ord(char) == 9:
#         sanitized_string += char

#     return sanitized_string

def get_user_id(req):
  user_id = req.user.id
  print("SESSION DATA: >>>>> " + str(user_id))
  return user_id

def delete_pdf_files():
    folder_path = f'{settings.MEDIA_ROOT}/{settings.UPLOAD_FILES}/'
    try:
        for filename in os.listdir(folder_path):
            if filename.endswith(".pdf"):
                file_path = os.path.join(folder_path, filename)
                os.remove(file_path)
                print(f"Deleted: {file_path}")
        print("Deletion completed.")
    except Exception as e:
        print(f"An error occurred: {e}")

def create_record_file(questions):
  my_str = ''
  
  for qtn in questions:
    my_str += f'{qtn.id}. {qtn.question}\n'
    print(f'{qtn.id}. {qtn.question}\n')
  
  file_path = f'{settings.MEDIA_ROOT}/{settings.RECORDS}/questions-{datetime.datetime.now().strftime("%Y%m%d%X").replace(":", "")}.txt'
  file = open(file_path, 'w')
  file.write(my_str)
  file.close
  return file_path
 
def create_textfile(brand, bio):
  file_path = f'{settings.MEDIA_ROOT}/{settings.UPLOAD_FILES}/{brand.replace(" ", "-")}.txt'
  file = open(file_path, 'w')
  file.write(bio)
  file.close
  return file_path

def read_html_file(file_path):
  with open(file_path, 'r') as file:
    content = file.read()
  return content


def replace_texts(my_string, keywords):
  new_string = my_string
  for k, v in keywords.items():
    new_string = new_string.replace(k, v)
  return new_string
  

def create_htmlfile(string):
  file_path = f'{settings.MEDIA_ROOT}/{settings.EMAIL_NEWSLETTER}/{datetime.now().strftime("%Y%m%d%X").replace(":", "")}.html'
  file = open(file_path, 'w')
  file.write(string)
  file.close
  return file_path

def read_file(file):
  prompt=f'''Extract all the emails, first names, last names and other details from this text: {file} and organise it into one python dictionary and use the email as the key so if there are duplicate emails remove them. make sure I can iterate through this dictionary.'''
  response = openai.chat.completions.create(
		model="gpt-4o",
    messages=[{
      'role': 'user',
      'content': prompt
    }],
		temperature=0.2,
		max_tokens=500,
	)
  return response.choices[0].message.content


def generateBrandMemo(form):
	prompt=f'''Compose a 300-word brochure about a company based on these questions and answers:\n{form}.'''
	response = openai.chat.completions.create(
		model="gpt-4o",
    messages=[{
      'role': 'user',
      'content': prompt
    }],
		temperature=0.7,
		max_tokens=500,
	)
	return response.choices[0].message.content


def summarizeTimesheet(form):
	prompt=f'''Here is dictionary list of my timesheet, \n{form}. Take the tasks and hours and create summary paragraph of what I did.'''
	response = openai.chat.completions.create(
		model="gpt-4o",
    messages=[{
      'role': 'user',
      'content': prompt
    }],
		temperature=0.7,
		max_tokens=500,
	)
	return response.choices[0].message.content
  

def get_audio_from_text(text):
  client = boto3.client('polly')
  
  voice_id = 'Ayanda'
  engine = 'neural'
  output_format = 'mp3'
  
  response = client.synthesize_speech(
    Text=text,
    OutputFormat=output_format,
    VoiceId=voice_id,
    Engine=engine
  )
  
  audio_stream = response['AudioStream']
  
  audio_base64 = base64.b64encode(audio_stream.read()).decode('utf-8')
  return audio_base64


def generateBlogTopics(form):
	prompt=f'''Extract 20 compelling blog topics using this text {form}, Ensure the topics are educational.'''
	response = openai.chat.completions.create(
		model="gpt-4o",
    messages=[{
      'role': 'user',
      'content': prompt
    }],
		temperature=0.6,
		max_tokens=500,
	)
	return response.choices[0].message.content

def generateInterviewQtns(form):
	prompt=f'''Analyze the following job description and generate a list of potential interview questions. 
 The questions should be categorized into technical, behavioral and scenario-based questions and also 
 subcategorized by difficulty (basic, intermediate, advanced) and should focus on the key skills, technologies, 
 and responsibilities mentioned. Provide at least 5 questions for each subcategory and suggest any additional 
 topics the user should study to be well-prepared.
Also provide answers and ways of answering the questions if its a non technical question.
Job Description: {form}\n.
Please organise your response into a json object starting with the type of question, then the categories then question and answers. e.g)\n
{{"technical": {{"basic": [{{question:, answer:}} ]}} }}
'''
	response = openai.chat.completions.create(
		model="gpt-4o-mini",
    messages=[{
      'role': 'user',
      'content': prompt
    }],
    logprobs=True,
    top_logprobs=2,
		temperature=0.5,
    max_tokens=16384,
	)
	return response.choices[0].message.content, calculate_prompt_cost(response)


def generateEmail(brand, lead_role, lead, me, campaign, msg_tone):
  # result = generate_tasked_email.delay(brand, lead_role, lead, me)
  data = {'brand': brand,
          'lead_role': lead_role,
          'lead': lead,
          'me': me,
          'campaign': campaign,
          'msg_tone': msg_tone
          }

  result = requests.post(f'{settings.MOLOAI_PROCESS}/get-message/', data=data)
  return result.json()

# Amazon SES NEEDS a domain name so I will only be able to test it once its online
# import smtplib
# from email.mime.text import MIMEText

def send_email(user_email, recipients):
  result = requests.post(f'{settings.MOLOAI_PROCESS}/send-emails/', json={'user_email': user_email, 
                                                                          'recipients': recipients})
  return result.json()
  
from collections import defaultdict
def read_csv_file(upload_file):
    df = pd.read_csv(upload_file)
    
    result_list = []
    for _, row in df.iterrows():
        result_dict = {col: row[col] for col in df.columns}
        result_list.append(result_dict)
        
    # If you want to use a defaultdict for the final structure
    response = result_list
    
    # iterate through this
    return response
  
def read_xlsx_file(upload_file):
    data = pd.read_excel(upload_file)
    data_dict = data.to_dict(orient='records')
    return data_dict
  
def format_leads(leads):
    pass
    
def leave_message(email, subject, msg):
  automatic_sub = 'Automated response'
  return_msg = 'Thank you for reaching out. We will get back to you as soon as possible'
  
  send_mail(subject,msg,email,[settings.EMAIL_HOST_USER],fail_silently=False,)
  send_mail(automatic_sub,return_msg,settings.EMAIL_HOST_USER,[email],fail_silently=False,)


def convert_time(time):
    # time is already in seconds, so no need to calculate
    secs = int(time)
    mins = secs // 60
    hours = mins // 60

    secs = secs % 60
    mins = mins % 60
    hours = hours % 60

    return f"{str(hours).zfill(2)}:{str(mins).zfill(2)}"

# Example usage:
# print(convert_time(3661))  # Outputs: "01:01"



pfData = settings.PAYFAST

def generateSignature(dataArray, passPhrase = ''):
    payload = ""
    for key in dataArray:
        # Get all the data from Payfast and prepare parameter string
        payload += key + "=" + urllib.parse.quote_plus(dataArray[key].replace("+", " ")) + "&"
    # After looping through, cut the last & or append your passphrase
    payload = payload[:-1]
    if passPhrase != '':
        payload += f"&passphrase={passPhrase}"
    return hashlib.md5(payload.encode()).hexdigest()

passPhrase = 'Moloai051995'
signature = generateSignature(pfData, passPhrase)


def sendWhatsapp(the_user, user_email, order_id, products, cost):
    url = 'https://graph.facebook.com/v13.0/100319472708448/messages'
    myobj = {
        "messaging_product": "whatsapp",
        "to": "270729034855",
        "type": "template",
        "template": {
            "name": "marketonweb_sale",
            "language": {
                "code": "en"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": the_user
                        },
                        {
                            "type": "text",
                            "text": user_email
                        },
                        {
                            "type": "text",
                            "text": order_id
                        },
                        {
                            "type": "text",
                            "text": products
                        },
                        {
                            "type": "text",
                            "text": cost
                        },
                    ]
                }
            ]
        }
    }

    whatsapp = requests.post(url, json=myobj, headers={"Content-Type": "application/json",
                                                       "Authorization": "Bearer EAAHIU6dQ57ABAFRgMpHm3VXeWH3ekJWSA0Yjgn24LVhQ2CHupYvvOsPcceIoaOCIpfTwY5ZAuoRsNHg3he55zFVIKwbjVNO6yUl5HvZCPi3nbp8in6YABV03ZAZAnvonGnLufrDmucs2PwXr3xFfbUgPG2GATvpLmlYYzxg6c0RniZC1HhZBJnqGB0d1jDKx34RBZAvsPT2KwZDZD"})
    print(whatsapp.text)
    
    

def save_to_csv(name, email, location, occupation):
    try:
       with open(f'{settings.MEDIA_ROOT}/data.csv', 'a', newline='') as csvfile:
        fieldnames = ['Name', 'Email', 'Location', 'Occupation', 'Date_created']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        # Check if the file is empty and write header if necessary
        if csvfile.tell() == 0:
            writer.writeheader()

        # Write the data to the CSV file
        writer.writerow({'Name': name, 'Email': email, 'Location': location, 'Occupation': occupation, 'Date_created': datetime.now().strftime("%Y%m%d%X")})
        return ('You have been added to the list🎉', 'success')
   
    except Exception as e:
       return (f"Something went wrong😱 {e}", 'error')
     
     

def rename_logo(username, uploaded_file):
  new_name = f'{settings.COMPANY_LOGO}/{username.replace(" ", "-")}.png'
  file_path = f'{settings.MEDIA_ROOT}/{new_name}'

  # Save the uploaded PDF file with the new filename
  with open(file_path, 'wb+') as destination:
      for chunk in uploaded_file.chunks():
          destination.write(chunk)

  return new_name

def generate_email_template(company):
  result = requests.post(f'{settings.MOLOAI_PROCESS}/generate-email-template/', json={'company': company})
  print(result.json())
  return result.json()


def currency_conversion(currency="ZAR"):
  url = f'https://v6.exchangerate-api.com/v6/{settings.EXCHANGE_RATE_KEY}/latest/USD'
  response = requests.get(url)
  data = response.json()
  print(f"Currency => {data['conversion_rates'][currency]}")  # Get conversion rate to EUR
  return data['conversion_rates'][currency]
  
def convert_price(currency="ZAR"):
  if currency == 'USD':
    return currency_conversion(settings.ZAR[0]) * settings.USD[1]
  if currency == 'EUR':
    return currency_conversion(settings.ZAR[0]) * settings.EUR[1]
  return settings.ZAR[0]

def generate_hex_code(s):
    # Convert the string to bytes, then convert each byte to a hex representation
    hex_string = s.encode('utf-8').hex()
    return hex_string[:6]
    # return f"{hex_string[:8]}{datetime.now().strftime("%Y%m%d%H%M%S")}"



  