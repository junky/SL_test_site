class PagesController < ApplicationController
  def home
    @home_class = 'class="active"'
  end

  def contact
    @contact_class = 'class="active"'
  end

  def election_distract
    @distr_class = 'class="active"'
  end
end
