class StaticController < ApplicationController
  
  #
  # The launchrock display page.
  #
  def launch
    render :launch, :layout => false
  end
  
  #
  # The postcard view page.
  #
  def postcard
    @postcard_id = params[:view]
    render :postcard, :layout => false
  end
  
  #
  # The postcard tracking page.
  #
  def tracking
    render :tracking, :layout => false
  end
  
  #
  # The welcoming homepage.
  #
  def welcome
    render :welcome, :layout => "static"
  end
  
end