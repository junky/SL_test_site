# encoding: utf-8

class PagesController < ApplicationController
  def home
    @home_class = 'class="active"'
  end

  def contact
    @contact_class = 'class="active"'
    
    name = params[:name]
    email = params[:email]
    text = params[:text]
    if not name.nil? and not email.nil? and not text.nil? \
      and not name.empty? and not email.empty? and not text.empty?
      @contact = Contact.create(:name => name, :email => email, :text => text)
    end
  end

  def election_distract
    @distr_class = 'class="active"'
  end
end
