class HomeController < ApplicationController
  def index
  end

  def settings
    session[:locale] = params[:locale] if request.post?
  end

  def autosearch
    @results = 'Nothing Found'
    @results = 'Cat found!' if params[:search] == 'cat'
  end

  def redirect
    if not params[:redirect_url].nil? and not params[:redirect_url].empty?
      redirect_to params[:redirect_url], :status => :moved_permanently
    end
  end

  def images
  end
  
  def swaps
  end

  def javascript_files
    js_text = 'var txt="Hello World!";    document.write(txt.length);    var txt="ABCDEFGHIJKLMNOPQRSTUVWXYZ";    document.write(txt.length);'  

    headers["Content-Type"] = "text/javascript"
    render :inline => js_text
  end
end
