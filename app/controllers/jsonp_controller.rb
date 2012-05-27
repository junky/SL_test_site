# encoding: utf-8
require 'net/http'

class JsonpController < ApplicationController
  def jsonp
    url = params[:url]
    function_name = params[:callback]
      if not url.nil? and not function_name.nil?
        json_str = Net::HTTP.get(URI(url))
        json_str.gsub!('"', '\"')
        json_str.gsub!("\n", '')
        render :inline => function_name + '("'+ json_str + '")'
      else
        render :inline => ''
      end
  end
end