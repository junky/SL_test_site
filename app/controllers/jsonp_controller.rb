# encoding: utf-8

class JsonpController < ApplicationController
  def jsonp
    url = params[:url]
    function_name = params[:callback]
      if not url.nil? and not function_name.nil?
        json_str = Net::HTTP.get(URI(url))
        json_str.gsub!('"', '\"')
        render :inline => function_name + '("'+ json_str + '")'
      else
        render :inline => ''
      end
  end
end